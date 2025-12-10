import React from "react";
import { APIStore, ReuseDataStateStore } from "../../../store/Store";
import { MdAddCircle, MdEdit, MdDelete } from "react-icons/md";
import SOPButton from "../Interactions/Buttons/SOPButton";
import { Modes_Styles } from "../../../Styles";
import { HomeLayoutStyles } from "../../../Styles";

export default function Home() {
  const pullAuditTrail = APIStore((s) => s.pullAuditTrail);
  const GETAssetDataByID = APIStore((s) => s.GETAssetDataByID);
  const darkMode = ReuseDataStateStore((s) => s.data.DarkMode);

  const [auditTrail, setAuditTrail] = React.useState([]);
  const [changedBySet, setChangedBySet] = React.useState(new Set());
  const [viewAudit, setViewAduit] = React.useState("ALL");
  const [changedByAssets, setChangedByAssets] = React.useState([]);
  const [numberOfAuditTrailView, setNumberOfAuditTrailView] = React.useState(50);

  const theme = darkMode ? Modes_Styles.DarkMode : Modes_Styles.LightMode;

  const ui = {
    pageWrapper: `${HomeLayoutStyles.pageWrapper} ${theme.pageWrapper}`,
    button: `${HomeLayoutStyles.button} ${theme.button}`,
    buttonActive: `${HomeLayoutStyles.button} ${theme.buttonActive}`,
    cardOuter: `${HomeLayoutStyles.cardOuter} ${theme.cardOuter}`,
    cardInner: `${HomeLayoutStyles.cardInner} ${theme.cardInner}`,
    listItem: `${HomeLayoutStyles.listItem} ${theme.listItem}`,
    leftTag: `${HomeLayoutStyles.leftTag} ${theme.leftTag}`,
    rowText: `${HomeLayoutStyles.rowText} ${theme.rowText}`,
  };

  async function handleAuditTrailRefresh() {
    const data = await pullAuditTrail();
    const results = data.searchResults?.auditTrail || [];

    const byMap = new Map();
    for (const entry of results) {
      if (entry.action === "DELETE") continue;
      byMap.set(entry.changedBy, entry);
    }
    setChangedBySet(byMap);

    const ordered = [...byMap.values()];
    const assetList = [];

    for (let i = 0; i < ordered.length; i++) {
      const entry = ordered[i];
      if (entry.action === "DELETE") {
        assetList[i] = null;
        continue;
      }
      try {
        const res = await GETAssetDataByID({ id: entry.entityId, action: "get" });
        assetList[i] = res?.data?.item || null;
      } catch {
        assetList[i] = null;
      }
    }

    setChangedByAssets(assetList);

    const filtered = results.filter((e) => e.field !== "Budget Status");

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

  return (
    <div className={ui.pageWrapper}>
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Home Dashboard</h1>
        <SOPButton />
      </div>

      <div className={ui.cardOuter}>
        <div className="w-full flex justify-between items-center mt-2">
          <span className="text-xl font-bold pl-2">Audit Trail Viewer</span>
          <button className={ui.buttonActive} onClick={handleAuditTrailRefresh}>
            Refresh
          </button>
        </div>

        <div className={ui.cardInner}>
          <h3 className="text-base font-bold mb-2">User At Cabinet</h3>

          <div className="flex flex-col gap-2 max-h-[22rem] overflow-y-auto">
            {[...changedBySet].map((entry, index) => {
              const data = entry[1];

              return (
                <div key={index} className={ui.listItem}>
                  <div className={ui.leftTag}>
                    {data.action === "INSERT" ? (
                      <MdAddCircle size={20} />
                    ) : data.action === "UPDATE" ? (
                      <MdEdit size={20} />
                    ) : (
                      <MdDelete size={20} />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 px-2 justify-center">
                    <div className="flex flex-row w-full justify-between items-center gap-2">
                      <span className={ui.rowText}>{data.changedBy}</span>
                      <span className="text-base text-right truncate max-w-[40%]">
                        {changedByAssets[index]?.cmbCabinet ?? ""}
                      </span>
                    </div>
                    <span className="text-sm">{data.changedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={ui.cardInner}>
          <div className="flex flex-row justify-between pb-2">
            <h3 className="text-base font-bold mb-3">Audit Trail</h3>

            <div className="flex flex-row justify-center items-center gap-2">
              <span>Rows:</span>
              <select
                className="text-black h-[2rem] w-[4rem] rounded"
                value={numberOfAuditTrailView}
                onChange={(e) => setNumberOfAuditTrailView(e.target.value)}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mb-3 w-full">
            <button className={`${viewAudit === "ALL" ? ui.buttonActive : ui.button} flex-1`} onClick={() => setViewAduit("ALL")}>
              All
            </button>

            <button
              className={`${viewAudit === "INSERT" ? ui.buttonActive : ui.button} flex-1`}
              onClick={() => setViewAduit("INSERT")}
            >
              Creates
            </button>

            <button
              className={`${viewAudit === "UPDATE" ? ui.buttonActive : ui.button} flex-1`}
              onClick={() => setViewAduit("UPDATE")}
            >
              Updates
            </button>

            <button
              className={`${viewAudit === "DELETE" ? ui.buttonActive : ui.button} flex-1`}
              onClick={() => setViewAduit("DELETE")}
            >
              Deletes
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
            {auditTrail
              .filter((e) => (viewAudit === "ALL" ? true : e.action === viewAudit))
              .map((entry, index) => (
                <div key={index} className={ui.listItem}>
                  <div className={ui.leftTag}>
                    {entry.action === "INSERT" ? (
                      <MdAddCircle size={20} />
                    ) : entry.action === "UPDATE" ? (
                      <MdEdit size={20} />
                    ) : (
                      <MdDelete size={20} />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 px-2 justify-center">
                    <span className="text-sm">{entry.changedDate}</span>

                    <div className="flex flex-row w-full justify-between gap-2">
                      <span className={ui.rowText}>{entry.changedBy}</span>

                      <span className="text-base text-right truncate max-w-[50%]">
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
