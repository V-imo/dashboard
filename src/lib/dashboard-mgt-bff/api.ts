import { Agency, client, Inspection, Model, Property } from "./index";
import { Session } from "next-auth";
import { getClientHeaders } from "../utils";

export const getInspections = async (
  agencyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/inspection/{agencyId}", {
    params: {
      path: { agencyId },
    },
    headers,
  });
  return response.data;
};

export const getPropertyInspections = async (
  agencyId: string,
  propertyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/inspection/{agencyId}/{propertyId}", {
    params: {
      path: { agencyId, propertyId },
    },
    headers,
  });
  return response.data;
};

export const createInspection = async (
  inspection: Inspection,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.POST("/inspection", {
    body: inspection,
    headers,
  });
  if (!response.data) {
    throw new Error("Failed to create inspection: no inspection ID returned");
  }
  return response.data;
};

export const deleteInspection = async (
  agencyId: string,
  propertyId: string,
  inspectionId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/inspection/{inspectionId}", {
    params: {
      query: { agencyId, propertyId },
      path: { inspectionId },
    },
    headers,
  });
  return response.data;
};

export const getInspection = async (
  agencyId: string,
  propertyId: string,
  inspectionId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET(
    "/inspection/{agencyId}/{propertyId}/{inspectionId}",
    {
      params: {
        path: { agencyId, propertyId, inspectionId },
      },
      headers,
    }
  );
  return response.data;
};

export const updateInspection = async (
  inspection: Inspection,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.PATCH("/inspection", {
    body: inspection,
    headers,
  });
  return response.data;
};

export const getAgency = async (agencyId: string, session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/agency/{agencyId}", {
    params: {
      path: { agencyId },
    },
    headers,
  });
  return response.data;
};

export const updateAgency = async (agency: Agency, session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.PATCH("/agency", {
    body: agency,
    headers,
  });
  return response.data;
};

export const deleteAgency = async (
  agencyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/agency/{agencyId}", {
    params: {
      path: { agencyId },
    },
    headers,
  });
  return response.data;
};

export const getProperties = async (
  agencyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/property/{agencyId}", {
    params: {
      path: { agencyId },
    },
    headers,
  });
  return response.data;
};

export const createProperty = async (
  property: Property,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.POST("/property", {
    body: property,
    headers,
  });
  if (!response.data) {
    throw new Error("Failed to create property: no property ID returned");
  }
  return response.data;
};

export const updateProperty = async (
  property: Property,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.PATCH("/property", {
    body: property,
    headers,
  });
  return response.data;
};

export const deleteProperty = async (
  agencyId: string,
  propertyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/property/{agencyId}/{propertyId}", {
    params: {
      path: { agencyId, propertyId },
    },
    headers,
  });
  return response.data;
};

export const getProperty = async (
  agencyId: string,
  propertyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/property/{agencyId}/{propertyId}", {
    params: {
      path: { agencyId, propertyId },
    },
    headers,
  });
  return response.data;
};

export const getModels = async (agencyId: string, session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/model/{agencyId}", {
    params: {
      path: { agencyId },
    },
    headers,
  });
  return response.data;
};

export const getModel = async (
  agencyId: string,
  modelId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/model/{agencyId}/{modelId}", {
    params: {
      path: { agencyId, modelId },
    },
    headers,
  });
  return response.data;
};

export const createModel = async (
  model: Omit<Model, "modelId">,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.POST("/model", {
    body: model,
    headers,
  });
  if (!response.data) {
    throw new Error("Failed to create model: no model ID returned");
  }
  return response.data;
};

export const updateModel = async (model: Model, session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.PATCH("/model", {
    body: model,
    headers,
  });
  return response.data;
};

export const deleteModel = async (
  agencyId: string,
  modelId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/model/{agencyId}/{modelId}", {
    params: {
      path: { agencyId, modelId },
    },
    headers,
  });
  return response.data;
};
