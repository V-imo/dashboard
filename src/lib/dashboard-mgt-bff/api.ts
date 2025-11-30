import { Agency, client, Inspection, Model, Property, Room, RoomElement } from "./index";

export const getInspections = async (agencyId: string) => {
  const response = await client.GET("/inspection/{agencyId}", {
    params: {
      path: { agencyId },
    },
  });
  return response.data;
};

export const getPropertyInspections = async (
  agencyId: string,
  propertyId: string
) => {
  const response = await client.GET("/inspection/{agencyId}/{propertyId}", {
    params: {
      path: { agencyId, propertyId },
    },
  });
  return response.data;
};

export const createInspection = async (inspection: Inspection) => {
  const response = await client.POST("/inspection", {
    body: inspection,
  });
  return response.data;
};

export const deleteInspection = async (
  agencyId: string,
  propertyId: string,
  inspectionId: string
) => {
  const response = await client.DELETE("/inspection/{inspectionId}", {
    params: {
      query: { agencyId, propertyId },
      path: { inspectionId },
    },
  });
  return response.data;
};

export const getInspection = async (
  agencyId: string,
  propertyId: string,
  inspectionId: string
) => {
  const response = await client.GET(
    "/inspection/{agencyId}/{propertyId}/{inspectionId}",
    {
      params: {
        path: { agencyId, propertyId, inspectionId },
      },
    }
  );
  return response.data;
};

export const updateInspection = async (inspection: Inspection) => {
  const response = await client.PATCH("/inspection", {
    body: inspection,
  });
  return response.data;
};

export const getAgency = async (agencyId: string) => {
  const response = await client.GET("/agency/{agencyId}", {
    params: {
      path: { agencyId },
    },
  });
  return response.data;
};

export const updateAgency = async (agency: Agency) => {
  const response = await client.PATCH("/agency", {
    body: agency,
  });
  return response.data;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await client.DELETE("/agency/{agencyId}", {
    params: {
      path: { agencyId },
    },
  });
  return response.data;
};

export const getProperties = async (agencyId: string) => {
  const response = await client.GET("/property/{agencyId}", {
    params: {
      path: { agencyId },
    },
  });
  return response.data;
};

export const createProperty = async (property: Property) => {
  const response = await client.POST("/property", {
    body: property,
  });
  return response.data;
};

export const updateProperty = async (property: Property) => {
  const response = await client.PATCH("/property", {
    body: property,
  });
  return response.data;
};

export const deleteProperty = async (agencyId: string, propertyId: string) => {
  const response = await client.DELETE("/property/{agencyId}/{propertyId}", {
    params: {
      path: { agencyId, propertyId },
    },
  });
  return response.data;
};

export const getProperty = async (agencyId: string, propertyId: string) => {
  const response = await client.GET("/property/{agencyId}/{propertyId}", {
    params: {
      path: { agencyId, propertyId },
    },
  });
  return response.data;
};

export const getModels = async (agencyId: string) => {
  const response = await client.GET("/model/{agencyId}", {
    params: {
      path: { agencyId },
    },
  });
  return response.data;
};

export const getModel = async (agencyId: string, modelId: string) => {
  const response = await client.GET("/model/{agencyId}/{modelId}", {
    params: {
      path: { agencyId, modelId },
    },
  });
  return response.data;
};

export const createModel = async (model: Omit<Model, "modelId">) => {
  const response = await client.POST("/model", {
    body: model,
  });
  return response.data;
};

export const updateModel = async (model: Model) => {
  const response = await client.PATCH("/model", {
    body: model,
  });
  return response.data;
};

export const deleteModel = async (agencyId: string, modelId: string) => {
  const response = await client.DELETE("/model/{agencyId}/{modelId}", {
    params: {
      path: { agencyId, modelId },
    },
  });
  return response.data;
};


export const getRooms = async (propertyId: string) => {
  const response = await client.GET("/room/{propertyId}", {
    params: {
      path: { propertyId },
    },
  });
  return response.data;
};

export const createRoom = async (room: Omit<Room, "roomId">) => {
  const response = await client.POST("/room", {
    body: room,
  });
  return response.data;
};

export const updateRoom = async (room: Room) => {
  const response = await client.PATCH("/room", {
    body: room,
  });
  return response.data;
};

export const deleteRoom = async (propertyId: string, roomId: string) => {
  const response = await client.DELETE("/room/{propertyId}/{roomId}", {
    params: {
      path: { propertyId, roomId },
    },
  });
  return response.data;
};

export const getRoom = async (propertyId: string, roomId: string) => {
  const response = await client.GET("/room/{propertyId}/{roomId}", {
    params: {
      path: { propertyId, roomId },
    },
  });
  return response.data;
};

export const updateRoomElement = async (roomElement: RoomElement) => {
  const response = await client.PATCH("/room-element", {
    body: roomElement,
  });
  return response.data;
};

export const deleteRoomElement = async (propertyId: string, roomId: string, elementId: string) => {
  const response = await client.DELETE("/room-element/{propertyId}/{roomId}/{elementId}", {
    params: {
      path: { propertyId, roomId, elementId },
    },
  });
  return response.data;
};

export const getRoomElement = async (propertyId: string, roomId: string, elementId: string) => {
  const response = await client.GET("/room-element/{propertyId}/{roomId}/{elementId}", {
    params: {
      path: { propertyId, roomId, elementId },
    },
  });
  return response.data;
};

export const createRoomElement = async (roomElement: Omit<RoomElement, "elementId">) => {
  const response = await client.POST("/room-element", {
    body: roomElement,
  });
  return response.data;
};

export const getRoomElementsByProperty = async (propertyId: string) => {
  const response = await client.GET("/room-element/{propertyId}", {
    params: {
      path: { propertyId },
    },
  });
  return response.data;
};

export const getRoomElementsByRoom = async (propertyId: string, roomId: string) => {
  const response = await client.GET("/room-element/{propertyId}/{roomId}", {
    params: {
      path: { propertyId, roomId },
    },
  });
  return response.data;
};
