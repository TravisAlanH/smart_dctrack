import React from "react";
import CreateModel_GetModelFromInstance from "./CreateModel_GetModelFromInstance";
import { APIStore } from "../../../../../store/Store";
import CreateModel_EditDupeModel from "./CreateModel_EditDupeModel";

export default function CreateModel({ ui }) {
  const CreateModel = APIStore((s) => s.data.CreateModel);

  return (
    <div>
      {Object.keys(CreateModel.payload).length === 0 ? (
        <div>
          <div>
            <CreateModel_GetModelFromInstance ui={ui} />
          </div>
        </div>
      ) : (
        <div>
          <div>
            <CreateModel_EditDupeModel ui={ui} />
          </div>
        </div>
      )}
    </div>
  );
}
