import React from "react";
import { APIStore } from "../../../store/Store";

export default function Home() {
  const pullAuditTrail = APIStore((state) => state.pullAuditTrail);
  const GETAssetDataByID = APIStore((state) => state.GETAssetDataByID);

  const [auditTrail, setAuditTrail] = React.useState([]);
  const [changedBySet, setChangedBySet] = React.useState(new Set());
  const [viewAudit, setViewAduit] = React.useState("ALL");
  const [changedByAssets, setChangedByAssets] = React.useState([]);

  async function handleAuditTrailRefresh() {
    const data = await pullAuditTrail();
    const results = data.searchResults?.auditTrail || [];

    // 1. Map of most recent entry per changedBy
    const byMap = new Map();
    for (const entry of results) {
      byMap.set(entry.changedBy, entry);
    }
    setChangedBySet(byMap);

    // 1b. Load asset details using same index ordering
    const orderedEntries = [...byMap.values()];

    const assetList = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];
      const payload = {
        id: entry.entityId,
        action: "get",
      };
      if (entry.action === "DELETE") {
        assetList[i] = null;
        continue;
      }
      try {
        const res = await GETAssetDataByID(payload);
        assetList[i] = res?.data?.item || null;
      } catch {
        assetList[i] = null;
      }
    }

    setChangedByAssets(assetList);

    // 2. Filter out Budget Status
    const filteredResults = results.filter((entry) => entry && entry.field !== "Budget Status");

    // 3. Remove duplicate INSERT bursts
    const deduped = [];
    const seen = new Set();

    for (const entry of filteredResults) {
      if (entry.action === "INSERT") {
        const key = `${entry.entityId}_${entry.changedDate}`;
        if (seen.has(key)) continue;
        seen.add(key);
      }
      deduped.push(entry);
    }

    // 4. Last 50
    const last = deduped.slice(-50);

    // 5. Newest first
    setAuditTrail(last.reverse());
  }

  // console.log(auditTrail);
  console.log(changedByAssets);

  const buttonStype = "bg-slate-300 test-black m-2 px-2 py-1 rounded hover:bg-slate-400";

  return (
    <div>
      <div className="flex flex-col justify-start items-center m-4">
        <button className={buttonStype} onClick={() => handleAuditTrailRefresh()}>
          Refresh
        </button>
        <div className="border w-full mx-4">
          <div className="border m-4">
            <label className="font-bold text-white">Last Known Cabinet</label>
            <div className="overflow-y-auto overflow-x-hidden">
              {[...changedBySet].map((entry, index) => {
                console.log(entry);
                const data = entry[1];
                return (
                  <div key={index} className="border h-[3rem] text-white">
                    <div className="flex flex-row justify-start h-full">
                      <div className="w-[3rem] h-full border flex flex-row justify-center items-center">
                        {data.action === "INSERT" ? "I" : data.action === "UPDATE" ? "U" : "D"}
                      </div>
                      <div className="w-[100%] h-full flex flex-col justify-start items-start px-2">
                        <div className="flex flex-row w-full justify-between items-start">
                          <span>{data.changedBy}</span>
                          <span>{changedByAssets[index]?.cmbCabinet ?? ""}</span>
                        </div>
                        <div className="flex flex-row justify-start items-start text-sm">
                          <span>{data.changedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border w-full mx-4">
          <div className="border m-4">
            <div className="flex flex-row justify-around">
              <button className={buttonStype} onClick={() => setViewAduit("ALL")}>
                All
              </button>
              <button className={buttonStype} onClick={() => setViewAduit("INSERT")}>
                Creates
              </button>
              <button className={buttonStype} onClick={() => setViewAduit("UPDATE")}>
                Updates
              </button>
              <button className={buttonStype} onClick={() => setViewAduit("DELETE")}>
                Deletes
              </button>
            </div>
            <div className="overflow-y-auto overflow-x-hidden h-[30rem]">
              {auditTrail
                .filter((entry) => (viewAudit === "ALL" ? true : entry.action === viewAudit))
                .map((entry, index) => (
                  <div key={index} className="border h-[3rem] text-white">
                    <div className="flex flex-row justify-start h-full">
                      <div className="w-[3rem] h-full border flex flex-row justify-center items-center">
                        {entry.action === "INSERT" ? "I" : entry.action === "UPDATE" ? "U" : "D"}
                      </div>
                      <div className="w-[100%] h-full flex flex-col justify-start items-start px-2">
                        <div className="flex flex-row justify-start items-start">
                          <span>{entry.changedDate}</span>
                        </div>
                        <div className="flex flex-row w-full justify-between items-start">
                          <span>{entry.changedBy}</span>
                          <span>{entry.action === "DELETE" ? entry.changedFrom : entry.entityName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
