import { Agency, client, Inspection, Model, Property } from "./index";
import { Session } from "next-auth";
import { getClientHeaders } from "../utils";

export const getInspections = async (
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/inspection", {
    headers,
  });
  return response.data;
};

export const getPropertyInspections = async (
  propertyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/inspection/{propertyId}", {
    params: {
      path: {propertyId },
    },
    headers,
  });
  return response.data;
};

export const createInspection = async (
  inspection: Omit<Inspection, "agencyId">,
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
  propertyId: string,
  inspectionId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/inspection/{inspectionId}", {
    params: {
      query: { propertyId },
      path: { inspectionId },
    },
    headers,
  });
  return response.data;
};

export const getInspection = async (
  propertyId: string,
  inspectionId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET(
    "/inspection/{propertyId}/{inspectionId}",
    {
      params: {
        path: { propertyId, inspectionId },
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

export const getAgency = async ( session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/agency", {
    headers,
  });
  return response.data;
};

export const updateAgency = async (agency: Omit<Agency, "agencyId">, session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.PATCH("/agency", {
    body: agency,
    headers,
  });
  return response.data;
};

export const getProperties = async (
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/property", {
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
  propertyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/property/{propertyId}", {
    params: {
      path: { propertyId },
    },
    headers,
  });
  return response.data;
};

export const getProperty = async (
  propertyId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/property/{propertyId}", {
    params: {
      path: { propertyId },
    },
    headers,
  });
  return response.data;
};

export const getModels = async (session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/model", {
    headers,
  });
  return response.data;
};

export const getModel = async (
  modelId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.GET("/model/{modelId}", {
    params: {
      path: { modelId },
    },
    headers,
  });
  return response.data;
};

export const createModel = async (
  model: Omit<Model, "modelId" | "agencyId">,
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

export const updateModel = async (model: Omit<Model, "agencyId">, session: Session | null) => {
  const headers = getClientHeaders(session);
  const response = await client.PATCH("/model", {
    body: model,
    headers,
  });
  return response.data;
};

export const deleteModel = async (
  modelId: string,
  session: Session | null
) => {
  const headers = getClientHeaders(session);
  const response = await client.DELETE("/model/{modelId}", {
    params: {
      path: { modelId },
    },
    headers,
  });
  return response.data;
};
