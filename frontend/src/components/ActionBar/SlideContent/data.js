const SELECT_CABINET_INFO = {
  type: "setCabLocInfo",
  text: "Please select a location and cabinet to view cabinet details.",
  label: "Select Location and Cabinet",
};

const DELETE_ASSET_CONFIRMATION = {
  type: "Delete Asset",
  text: "Are you sure you want to delete this asset? This action cannot be undone.",
  label: {
    subClassId: 103,
    _isItemEditable: true,
    modelId: 28701,
    formFactor: "Fixed",
    subClassName: "Standard",
    className: "Device",
    classId: 1,
    _isItemDeletable: true,
    cmbMake: "Dell",
    cmbModel: "PowerEdge R740",
    _isItemViewable: true,
    id: 325,
    tiRackUnits: 2,
    tiEffectivePower: 0,
    tiWeight: 72,
    classCode: 1200,
    subClassCode: 1201,
    tiPotentialPower: 450,
    radioRailsUsed: "Both",
    cmbStatus: "Planned",
    cmbUPosition: 32,
    tiSerialNumber: "SB-1711",
    mounting: "Rackable",
    tiName: "TEST DELL U2",
  },
};

const GOOD_EDIT = {
  type: "APIResponse",
};

const GOOD_ADD = {
  type: "APIResponse",
};

const BAD_EDIT = {
  type: "APIResponse",
  data: {
    children: [],
    errorList: ["The UPosition 19 is not available in Cabinet CAB02. Please choose a different position."],
    httpCode: 400,
    httpStatus: "Bad Request",
    message: "Unsuccessful operation",
    success: false,
    warningCodes: [],
    warningList: [],
  },
};

const BAD_ADD = {
  type: "APIResponse",
  data: {
    children: [],
    errorList: ["The UPosition 10 is not available in Cabinet CAB02. Please choose a different position."],
    httpCode: 400,
    httpStatus: "Bad Request",
    message: "Unsuccessful operation",
    success: false,
    warningCodes: [],
    warningList: [],
  },
};
