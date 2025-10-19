interface EndpointInterface {
  url: string;
  requiredPermission?: string;
}

type EndpointContent = Record<string, EndpointInterface>;

export const LEAVE_ENDPOINT: EndpointContent = {
  balance: {
    url: "leave-type/assigned",
  },
  request: {
    url: "leave-request/resource",
  },
  resource: {
    url: "leave-type/resource",
    requiredPermission: "read.leave_type_resource",
  },
};

export const ONBOARDING_ENDPOINT: EndpointContent = {
  assigned: {
    url: "onboarding/assigned",
  },
  resource: {
    url: "onboarding/resource",
    requiredPermission: "read.onboarding_resource",
  },
};
