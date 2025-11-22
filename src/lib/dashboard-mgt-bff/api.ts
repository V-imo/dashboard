import { Agency, client, Inspection, Property } from "./index";

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
