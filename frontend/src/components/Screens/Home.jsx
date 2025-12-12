import React from "react";
import { APIStore } from "../../../store/Store";
import { MdAddCircleOutline, MdEdit, MdDelete, MdAddCircle } from "react-icons/md";
import SOPButton from "../Interactions/Buttons/SOPButton";

export default function Home() {
  const pullAuditTrail = APIStore((s) => s.pullAuditTrail);
  const GETAssetDataByID = APIStore((s) => s.GETAssetDataByID);

  const [auditTrail, setAuditTrail] = React.useState([]);
  const [changedBySet, setChangedBySet] = React.useState(new Set());
  const [viewAudit, setViewAduit] = React.useState("ALL");
  const [changedByAssets, setChangedByAssets] = React.useState([]);
  const [numberOfAuditTrailView, setNumberOfAuditTrailView] = React.useState(50);

  console.log(auditTrail);

  async function handleAuditTrailRefresh() {
    const data = await pullAuditTrail();
    const results = data.searchResults?.auditTrail || [];

    // Map latest by user
    const byMap = new Map();
    for (const entry of results) {
      if (entry.action === "DELETE") continue;
      byMap.set(entry.changedBy, entry);
    }
    setChangedBySet(byMap);

    // Load assets for each entry
    const ordered = [...byMap.values()];
    const assetList = [];

    for (let i = 0; i < ordered.length; i++) {
      const entry = ordered[i];
      if (entry.action === "DELETE") {
        assetList[i] = null;
        continue;
      }
      try {
        const payload = { id: entry.entityId, action: "get" };
        const res = await GETAssetDataByID(payload);
        assetList[i] = res?.data?.item || null;
      } catch {
        assetList[i] = null;
      }
    }

    setChangedByAssets(assetList);

    // Filter out Budget Status
    const filtered = results.filter((e) => e.field !== "Budget Status");

    // Dedup inserts
    const dedup = [];
    const seen = new Set();

    for (const e of filtered) {
      if (e.action === "INSERT") {
        const key = `${e.entityId}_${e.changedDate}`;
        if (seen.has(key)) continue;
        seen.add(key);
      }
      dedup.push(e);
    }

    const last = dedup.slice(-numberOfAuditTrailView).reverse();

    setAuditTrail(last);
  }

  const pageWrapper = "w-full h-full overflow-y-auto p-3 pb-24 text-white";

  // MATCHES CABINET BUTTON STYLE
  const buttonStyle = " bg-slate-800 text-white px-3 py-1 rounded text-base hover:bg-slate-700";
  const buttonActiveStyle = " bg-blue-600 text-white px-3 py-1 rounded text-base hover:bg-blue-500";

  const cardOuter = "flex flex-col gap-2 bg-slate-600 border border-gray-500 rounded-lg w-full p-1 text-white";
  const cardInner = "flex flex-col gap-2 bg-slate-700 border border-gray-500 rounded-lg w-full p-3 text-white";

  const listItem = "w-full bg-white rounded-md flex flex-row items-center h-14 pr-2 text-black";

  const leftTag =
    "rounded-l-md w-12 min-w-[3rem] h-full flex items-center justify-center bg-slate-200 border-r border-gray-400 text-base font-bold text-black";

  const rowText = "text-base truncate";

  return (
    <div className={pageWrapper}>
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Home Dashboard</h1>
        <SOPButton />
      </div>
      <div className={cardOuter}>
        {/* Refresh button */}
        <div className="w-full flex justify-between items-center mt-2">
          <span className="text-xl font-bold pl-2">Audit Trail Viewer</span>
          <button className={buttonActiveStyle} onClick={handleAuditTrailRefresh}>
            Refresh
          </button>
        </div>

        {/* Last Known Cabinet */}
        <div className={cardInner}>
          <h3 className="text-base font-bold mb-2">User At Cabinet (last known)</h3>

          <div className="flex flex-col gap-2 max-h-[22rem] overflow-y-auto">
            {[...changedBySet].map((entry, index) => {
              const data = entry[1];
              return (
                <div key={index} className={listItem}>
                  <div className={leftTag}>
                    {data.action === "INSERT" ? (
                      <MdAddCircle size={20} />
                    ) : data.action === "UPDATE" ? (
                      <MdEdit size={20} />
                    ) : (
                      <MdDelete size={20} />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 px-2 justify-center text-black">
                    <div className="flex flex-row w-full justify-between items-center gap-2">
                      <span className={rowText}>{data.changedBy}</span>
                      <span className="text-base text-right truncate max-w-[40%] text-black">
                        {changedByAssets[index]?.cmbCabinet ?? ""}
                      </span>
                    </div>

                    <span className="text-sm text-black">{data.changedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Trail */}
        <div className={cardInner}>
          <div className="flex flex-row justify-between pb-2">
            <h3 className="text-base font-bold mb-3">Audit Trail</h3>
            <div className="flex flex-row justify-center items-center gap-2">
              <span className="text-white mr-2">Rows:</span>
              <select
                className=" text-black h-[2rem] w-[4rem] rounded"
                value={numberOfAuditTrailView}
                onChange={(e) => {
                  setNumberOfAuditTrailView(e.target.value);
                }}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-3 w-full">
            <button
              className={`${viewAudit === "ALL" ? buttonActiveStyle : buttonStyle} flex-1`}
              onClick={() => setViewAduit("ALL")}
            >
              All
            </button>

            <button
              className={`${viewAudit === "INSERT" ? buttonActiveStyle : buttonStyle} flex-1`}
              onClick={() => setViewAduit("INSERT")}
            >
              Creates
            </button>

            <button
              className={`${viewAudit === "UPDATE" ? buttonActiveStyle : buttonStyle} flex-1`}
              onClick={() => setViewAduit("UPDATE")}
            >
              Updates
            </button>

            <button
              className={`${viewAudit === "DELETE" ? buttonActiveStyle : buttonStyle} flex-1`}
              onClick={() => setViewAduit("DELETE")}
            >
              Deletes
            </button>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
            {auditTrail
              .filter((e) => (viewAudit === "ALL" ? true : e.action === viewAudit))
              .map((entry, index) => (
                <div key={index} className={listItem}>
                  <div className={leftTag}>
                    {entry.action === "INSERT" ? (
                      <MdAddCircle size={20} />
                    ) : entry.action === "UPDATE" ? (
                      <MdEdit size={20} />
                    ) : (
                      <MdDelete size={20} />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 px-2 justify-center text-black">
                    <span className="text-sm text-black">{entry.changedDate}</span>

                    <div className="flex flex-row w-full justify-between gap-2">
                      <span className={rowText}>{entry.changedBy}</span>

                      <span className="text-base text-right truncate max-w-[50%] text-black">
                        {entry.action === "DELETE" ? entry.changedFrom : entry.entityName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
