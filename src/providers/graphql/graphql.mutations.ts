import gql from 'graphql-tag';

export const updateTicket = gql`
mutation UpdateTicket($id: Int!, $ticket: TicketInput!) {
  updateTicket(id: $id, ticket: $ticket) {
    id
  }
}
`;

export const updateAlert = gql`
mutation UpdateAlert($id: Int!, $alert: AlertInput!) {
  updateAlert(id: $id, alert: $alert) {
    id
    isRead
    isOpened
  }
}
`;

export const createRfqSession = gql`
mutation CreateRfqSession($rfqSession: RfqSessionInput!) {
  createRfqSession(rfqSession: $rfqSession) {
    id
  }
}
`;

export const createContract = gql`
mutation CreateContract($contract: ContractInput!) {
  createContract(contract: $contract) {
    contractID
    serviceTypeID
    stateID
    effectiveDate
    locations {
      zone
      annualUsage
      rateClass
      zipCode
      utilityID
      utility {
        utilityID
        baseRate
      }
    }
  }
}
`;

export const createEntity = gql`
mutation CreateEntity($entity: EntityInput!) {
  createEntity(entity: $entity) {
    id
    name
  }
}
`;

export const addCustomerCard = gql`
mutation AddAPI2CustomerCard($stripeCustomerID: String!, $sourceToken: String!) {
  addCustomerCard(stripeCustomerID: $stripeCustomerID, sourceToken: $sourceToken) {
    exp_month
    exp_year
    last4
    id
  }
}
`;

export const createStripeCustomer = gql`
mutation CreateAPI2StripeCustomer($email: String!, $name: String!) {
  createStripeCustomer(email: $email, name: $name) {
    id
  }
}
`;

export const updateEntity = gql`
mutation UpdateEntity($id: Int!, $entity: EntityInput!) {
  updateEntity(id: $id, entity: $entity) {
    id
    name
  }
}
`;

export const createUser = gql`
mutation CreateUser($user: UserInput!) {
  createUser(user: $user) {
    userID
  }
}
`;

export const updateUser = gql`
mutation UpdateUser($id: String!, $user: UserInput!) {
  updateUser(id: $id, user: $user) {
    userID
    phone
    email
    username
    fname
    lname
    billingAddress1
    billingAddress2
    billingCity
    billingStateID
    billingZipCode
    initials
    autoRenewContracts
    subscribeToMobileNotifications
    signature
  }
}
`;

export const updateCustomer = gql`
mutation UpdateCustomer($id: String!, $customer: CustomerInput!) {
  updateCustomer(id: $id, customer: $customer) {
    entityID
  }
}
`;

export const createContractLocation = gql`
mutation CreateContractLocation($contractLocation: ContractLocationInput!) {
  createContractLocation(contractLocation: $contractLocation) {
    contractLocationID
    contractID
    address1
    address2
    city
    stateID
    zipCode
    utilityAccountNum
    utilityMeterNum
    utilityNameKey
    utilityReferenceNum
    rateClass
    zone
    annualUsage
    utilityID
    state {
      stateLong
      stateShort
    }
    utility {
      utilityID
      name
      abbreviation
    }
  }
}
`;

export const createTicketComment = gql`
mutation CreateTicketComment($ticketComment: TicketCommentInput!) {
  createTicketComment(ticketComment: $ticketComment) {
    id
    addDate
  }
}
`;

export const refreshToken = gql`
mutation RefreshToken {
  refreshToken {
    token
  }
}
`;

export const revokeToken = gql`
mutation RevokeToken {
  revokeToken
}
`;

export const chargeCustomer = gql`
mutation ChargeAPI2Customer($stripeCustomerID: String!, $amount: Float!, $chargeDescription: String!, $existingSourceID: String!) {
  chargeCustomer(stripeCustomerID: $stripeCustomerID, amount: $amount, chargeDescription: $chargeDescription, existingSourceID: $existingSourceID) {
    id
    amount
    failure_code
    failure_message
  }
}
`;

export const createFeedback = gql`
mutation CreateFeedback($feedback: FeedbackInput!) {
  createFeedback(feedback: $feedback) {
    id
  }
}
`;

export const updateRfqSession = gql`
mutation UpdateRfqSession($id: String!, $rfqSession: RfqSessionInput!) {
  updateRfqSession(id: $id, rfqSession: $rfqSession) {
    id
  }
}
`;

export const extendRfqSession = gql`
mutation ExtendRfqSession($id: String!, $rfqSession: RfqSessionInput!) {
  extendRfqSession(id: $id, rfqSession: $rfqSession) {
    id
  }
}
`;

export const updateContractLocation = gql`
mutation UpdateContractLocation($contractLocationID: String!, $contractLocation: ContractLocationInput!) {
  updateContractLocation(contractLocationID: $contractLocationID, contractLocation: $contractLocation) {
    contractLocationID
    contractID
    address1
    address2
    city
    stateID
    zipCode
    utilityAccountNum
    utilityMeterNum
    utilityNameKey
    utilityReferenceNum
    rateClass
    zone
    annualUsage
    utilityID
    state {
      stateLong
      stateShort
    }
    utility {
      utilityID
      name
      abbreviation
    }
  }
}
`;

export const updateContract = gql`
mutation UpdateContract($id: String!, $contract: ContractInput!) {
  updateContract(id: $id, contract: $contract) {
    contractID
    contractNum
  }
}
`;

export const createTicket = gql`
mutation CreateTicket($ticket: TicketInput!) {
  createTicket(ticket: $ticket) {
    id
  }
}
`;