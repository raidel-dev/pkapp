import gql from 'graphql-tag';

export const getNewContractPageData = gql`
query GetNewContractPageData($userID: String!) {
  user(userID: $userID) {
    fname
    lname
    email
    title
    DBAName
    phone
    phone2
    billingAddress1
    billingAddress2
    billingCity
    billingStateID
    billingState {
      stateLong
      stateShort
    }
    billingZipCode
    entities(sort: "name") {
      id
      name
    }
  }
  states(criteria: { isActive: true }) {
    data {
      stateID
      stateLong
      stateShort
    }
  }
  serviceTypes(criteria: { isActive: true }) {
    data {
      serviceTypeID
      name
    }
  }
}
`;

export const getAuctionInProgressContractPageData = gql`
query GetAuctionInProgressContractPageData($contractID: String!) {
  contract(contractID: $contractID) {
    contractID
    serviceTypeID
    effectiveDate
    stateID
    status
    locations {
      zipCode
      stateID
      utilityID
      rateClass
      annualUsage
      zone
      utility {
        baseRate
      }
    }
  }
}
`;

export const getAuctionInProgressPageData = gql`
query GetAuctionInProgressPageData($contractID: String!, $rateCriteria: RateInput) {
  rfqSession(contractID: $contractID) {
    id
    startDate
    startTime
    endDate
    endTime
    contractID
    maxExtends
    products {
      id
      productID
      term
    }
    rates {
      rate
      term
      displayRate
      savings
      logo
      supplierID
      productID
      bandwidthPercentage
      billingMethod
      enRateDetail
      product {
        id
        name
        term
      }
      supplier {
        supplierID
        name
      }
    }
    contract {
      customerID
      contractID
      contractNum
      expirationDate
      effectiveDate
      rate
      serviceTypeID
      stateID
      annualUsage
      status
      supplierID
      customer {
        contactFname
        contactLname
        DBAName
        address1
        address2
        city
        stateID
        state {
          stateLong
          stateShort
        }
        phone
        phone2
        email
        zipCode
        billingAddress1
        billingAddress2
        billingCity
        billingStateID
        billingState {
          stateLong
          stateShort
        }
        billingZipCode
      }
      locations {
        address1
        address2
        city
        zipCode
        stateID
        utilityAccountNum
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
  }
  rates(criteria: $rateCriteria) {
    data {
      DISPLAYRATE
      RATE
      TERM
      PRODUCTID
      SUPPLIERID
      LOGO
      SAVINGS
      BANDWIDTHPERCENTAGE
      GREENPERCENTAGE
      BILLINGMETHOD
      ENRATEDETAIL
      product {
        id
        name
        term
      }
      supplier {
        supplierID
        name
      }
    }
  }
}
`;

export const getAvailableSuppliers = gql`
query GetAvailableSuppliers($serviceTypeID: String!, $stateID: String!) {
  availableSuppliers(serviceTypeID: $serviceTypeID, stateID: $stateID) {
    data {
      supplierID
      name
      logo
    }
  }
}
`;

export const getDefaultProducts = gql`
query GetDefaultProducts($userID: String!, $serviceTypeID: String!) {
  user(userID: $userID) {
    defaultProducts(serviceTypeID: $serviceTypeID) {
      id
      term
      name
    }
  }
}
`;

export const getZipCode = gql`
query GetZipCode($zipCode: String!) {
  zipCode(zipCode: $zipCode) {
    city
    stateID
    stateLong
    stateShort
  }
}
`;

export const getAddEditLocationPageData = gql`
query GetAddEditLocationPageData {
  states(criteria: { isActive: true }) {
    data {
      stateID
      stateLong
      stateShort
    }
  }
}
`;

export const getUtilitiesWithProperties = gql`
query GetUtilitiesWithProperties($serviceTypeID: String!, $stateID: String!) {
  utilities(criteria: { stateID: $stateID, serviceTypeID: $serviceTypeID, isActive: true, noChildren: true }) {
    data {
      utilityID
      name
      abbreviation
      showNameKey
      showMeterNum
      showReferenceNum
      accountNumFormatHelp
      accountNumLabel
      accountNumFormat
      sampleBillAttachmentID
      rateClasses(stateID: $stateID) {
        name
        isDefault
      }
      zones(stateID: $stateID, serviceTypeID: $serviceTypeID) {
        name
      }
      unit(stateID: $stateID, serviceTypeID: $serviceTypeID)
    }
  }
}
`;

export const getZipCodeWithDefaultUtilities = gql`
query GetZipCodeWithDefaultUtilities($zipCode: String!, $serviceTypeID: String!) {
  zipCode(zipCode: $zipCode) {
    city
    stateID
    stateShort
    stateLong
    defaultUtilityZone
    defaultUtilities(serviceTypeID: $serviceTypeID) {
      utilityID
      serviceTypeID
    }
  }
}
`;

export const getPreloadedContractData = gql`
query GetContractsData($userID: String!) {
  user(userID: $userID) {
    contracts {
      contractNum
      status
      serviceTypeID
      stateID
      contractDate
      effectiveDate
      expirationDate
      customerID
      term
      rate
      customer {
        DBAName
        address1
        address2
        phone
        email
        entityID
        entity {
          id
          name
        }
      }
      serviceType {
        name
      }
    }
  }
}
`;

export const getUserQuestionAnswersData = gql`
query GetUserQuestionAnswersData($userID: String!) {
  user(userID: $userID) {
    questionAnswers {
      questionID
      answer
      isActive
      question {
        question
        type
        isActive
      }
    }
  }
}
`;

export const getContractDetailData = gql`
query GetContractDetailData($userID: String!, $contractID: String!) {
  user(userID: $userID) {
    entities(sort: "name") {
      id
      name
    }
  }
  contract(contractID: $contractID) {
    contractID
    contractNum
    term
    rate
    effectiveDate
    contractDate
    expirationDate
    status
    serviceTypeID
    serviceType {
      name
      serviceTypeID
    }
    customerID
    customer {
      DBAName
      phone
      email
      entityID
      entity {
        name
      }
    }
    locations {
      contractLocationID
      address1
      address2
      city
      zipCode
      stateID
      state {
        stateLong
        stateShort
      }
      utilityAccountNum
      utility {
        abbreviation
        utilityID
      }
      annualUsage
      utilityAccountNum
      utilityMeterNum
      utilityNameKey
      utilityReferenceNum
      zone
      rateClass
    }
  }
}
`;

export const getAuctionPageData = gql`
query GetAuctionPageData($userID: String!, $serviceTypeID: String!, $stateID: String!) {
  user(userID: $userID) {
    defaultProducts(serviceTypeID: $serviceTypeID) {
      productID
      term
      product {
        id
        name
        term
      }
    }
    questionAnswers {
      answer
      question {
        id
        question
      }
    }
  }
  availableSuppliers(serviceTypeID: $serviceTypeID, stateID: $stateID) {
    data {
      supplierID
      name
      logo
    }
  }
  products(criteria: { isActive: true, serviceTypeID: $serviceTypeID }) {
    data {
      id
      name
      term
    }
  }
}
`;

export const getEntityDetailPageData = gql`
query GetEntityDetailPageData($id: Int!) {
  entity(id: $id) {
    id
    name
    contracts {
      contractID
      contractNum
      customerID
      status
      serviceTypeID
      stateID
      contractDate
      effectiveDate
      expirationDate
      term
      rate
      renewalID
      customer {
        DBAName
        address1
        address2
        phone
        email
        entityID
        entity {
          id
          name
        }
      }
      serviceType {
        serviceTypeID
        name
      }
      locations {
        contractLocationID
        address1
        address2
        city
        zipCode
        utilityAccountNum
        utilityNameKey
        utilityMeterNum
        utilityReferenceNum
        stateID
        rateClass
        zone
        utilityID
        annualUsage
        state {
          stateShort
          stateLong
        }
        utility {
          utilityID
          name
          abbreviation
          showNameKey
          showMeterNum
          showReferenceNum
          accountNumFormatHelp
          accountNumLabel
          accountNumFormat
        }
      }

    }
  }
  states(criteria: { isActive: true }, sort: "stateShort asc") {
    data {
      stateID
      stateLong
      stateShort
    }
  }
}
`;

export const getEntitiesPageData = gql`
query GetEntitiesPageData($userID: String!) {
  user(userID: $userID) {
    entities {
      id
      name
      contracts {
        contractID
        renewalID
        customer {
          DBAName
        }
      }
    }
    contracts {
      contractID
      serviceTypeID
      status
      renewalID
      customer {
        DBAName
        entityID
        address1
        address2
      }
    }
  }
}
`;

export const sendErrorReport = gql`
query SendAPI2ErrorReport($message: String!, $report: String!) {
  sendErrorReport(message: $message, report: $report)
}
`;

export const sendSMS = gql`
query SendAPI2SMS($phoneNumber: String!, $body: String!) {
  sendSMS(phoneNumber: $phoneNumber, body: $body) {
    body
  }
}
`;

export const getRegistrationPageData = gql`
query GetRegistrationPageData {
  states(criteria: { isActive: true }) {
    data {
      stateID
      stateLong
      stateShort
    }
  }
}
`;

export const getStripeCustomerData = gql`
query GetAPI2StripeCustomerData($stripeCustomerID: String!) {
  customerCards(stripeCustomerID: $stripeCustomerID) {
    data {
      exp_month
      exp_year
      last4
      brand
      id
    }
  }
}
`;

export const getBillingInfoPageData = gql`
query GetBillingInfoPageData {
  states(criteria: { isActive: true }) {
    data {
      stateID
      stateLong
      stateShort
    }
  }
}
`;

export const getNewEntityExistingContractData = gql`
query GetNewEntityExistingContractData($userID: String!) {
  user(userID: $userID) {
    contracts {
      contractID
      contractNum
      expirationDate
      effectiveDate
      rate
      serviceTypeID
      customerID
      status
      stateID
      customer {
        entityID
        customerID
        DBAName
      }
    	serviceType {
        serviceTypeID
        name
      }
      locations {
        address1
        address2
        city
        zipCode
        rateClass
        zone
        annualUsage
        utilityID
        utility {
          utilityID
          name
          abbreviation
          baseRate
        }
      }
    }
  }
}
`;

export const getEmailSupportPageData = gql`
query GetEmailSupportPageData {
  ticketCategories(criteria: { isActive: true }, sort: "name asc") {
    data {
      id
      name
    }
  }
}
`;

export const getProfilePageData = gql`
query GetProfilePageData($userID: String!) {
  user(userID: $userID) {
    userID
    fname
    lname
    title
    DBAName
    username
    email
    password
    initials
    autoRenewContracts
    subscribeToMobileNotifications
    phone
    phone2
    roleID
    isActive
    billingAddress1
    billingAddress2
    billingCity
    billingZipCode
    stripeCustomerID
    signature
  }
}
`;

export const getContractHistoriesPageData = gql`
query GetContractHistoriesPageData($contractNum: String!, $customerID: String!) {
  contractHistories(contractNum: $contractNum, customerID: $customerID) {
    data {
      contractID
      contractNum
      effectiveDate
      expirationDate
      rate
      term
      status
      stateID
      product {
        name
      }
      supplier {
        logo
        name
      }
    }
  }
}
`;

export const getRiskTolerancePageData = gql`
query GetUserRiskTolerancePageData {
  questions(sort: "sortOrder asc") {
    data {
      id
      question
      type
      isActive
      answers {
        id
        questionID
        answer
      }
    }
  }
}
`;

export const getUserRiskTolerancePageData = gql`
query GetUserRiskTolerancePageData($userID: String!) {
  user(userID: $userID) {
    questionAnswers {
      id
      questionID
      answer
      isActive
      question {
        id
        question
        type
        isActive
      }
    }
  }
  questions(sort: "sortOrder asc") {
    data {
      id
      question
      type
      isActive
      answers {
        id
        questionID
        answer
      }
    }
  }
}
`;

export const getBillingPageData = gql`
query GetBillingPageData($userID: String!) {
  user(userID: $userID) {
    entities {
      id
      name
    }
    contracts {
      contractID
      contractNum
      expirationDate
      effectiveDate
      rate
      serviceTypeID
      stateID
      renewalID
      customer {
        customerID
        DBAName
        entityID
      }
    	serviceType {
        serviceTypeID
        name
      }
      supplier {
        supplierID
        name
      }
      locations {
        address1
        address2
        city
        zipCode
        rateClass
        zone
        annualUsage
        utilityID
        utility {
          utilityID
          name
          abbreviation
          baseRate
        }
        invoice {
          invoiceDate
          dueDate
          amount
          usage
          isPaid
          billPeriodStartDate
          billPeriodEndDate
        }
      }
    }
  }
}
`;

export const forgotPassword = gql`
query ForgotPassword($username: String!, $email: String!) {
  forgotPassword(username: $username, email: $email) {
    userID
  }
}
`;

export const authenticateUser = gql`
query AuthenticateUser($username: String!, $password: String!) {
  authenticateUser(username: $username, password: $password) {
    token
    userID
  }
}
`;

export const checkUser = gql`
query CheckUser($userID: String!) {
  user(userID: $userID) {
    userID
    isPasswordExpired
  }
}
`;

export const getUser = gql`
query GetUser($userID: String!) {
  user(userID: $userID) {
    userID
    isPasswordExpired
  }
}
`;

export const getAuctionCreateContractUserData = gql`
query GetAuctionCreateContractUserData($userID: String!) {
  user(userID: $userID) {
    email
    stripeCustomerID
    billingAddress1
    billingAddress2
    billingCity
    billingStateID
    billingZipCode
  }
}
`;

export const getAuctionCreateContractPageData = gql`
query GetAuctionCreateContractData($contractID: String!) {
  contract(contractID: $contractID) {
    contractID
    serviceTypeID
    customerID
    stateID
    annualUsage
    status
    effectiveDate
    rate
    term
    supplierID
    supplier {
      name
    }
    customer {
      contactFname
      contactLname
      email
      phone
      phone2
      address1
      address2
      city
      stateID
      state {
        stateShort
        stateLong
      }
      zipCode
      billingAddress1
      billingAddress2
      billingCity
      billingStateID
      billingState {
        stateShort
        stateLong
      }
      billingZipCode
    }
    locations {
      utilityID
      address1
      address2
      city
      stateID
      utility {
        abbreviation
      }
      state {
        stateLong
        stateShort
      }
      zipCode
      utilityAccountNum
    }
  }
}
`;

export const getContractDocuments = gql`
query ContractDocuments($criteria: DocumentInput){
  documents(criteria: $criteria) {
    data {
      name
      description
      attachmentID
      attachmentBase64
    }
  }
}`;

export const getTicketData = gql`
query GetTicketData($ticketID: Int!) {
  ticket(ticketID: $ticketID) {
    comments {
      id
      body
      addDate
      isInternal
    }
  }
}
`;

export const getFeedbackPageData = gql`
query GetFeedbackPageData($criteria: FeedbackInput) {
  feedbacks(criteria: $criteria) {
    data {
      appID
      addDate
    }
  }
}
`;

export const getContractReviewFeedbackPageData = gql`
query GetContractReviewFeedbackPageData($userID: String!) {
  user(userID: $userID) {
    contracts {
      contractID
      serviceTypeID
      expirationDate
      term
      supplierID
      customer {
        DBAName
      }
      supplier {
        name
        logo
      }
      feedback {
        id
      }
      product {
        name
      }
    }
  }
}
`;

export const getHomePageData = gql`
query GetHomePageData($userID: String!) {
  alerts(criteria: { isRead: false }, sort: "addDate desc") {
    data {
      id
      isRead
      isOpened
      addDate
      contractID
      foldedMessage
      unfoldedMessage
      alertType {
        name
      }
      contract {
        contractID
        contractNum
        expirationDate
        effectiveDate
        rate
        serviceTypeID
        stateID
        customer {
          customerID
          DBAName
        }
        serviceType {
          serviceTypeID
          name
        }
        supplier {
          supplierID
          name
          logo
        }
        locations {
          address1
          address2
          city
          zipCode
          rateClass
          zone
          annualUsage
          utilityID
          utility {
            utilityID
            name
            abbreviation
            baseRate
          }
        }
        rfqSession {
          id
          contractID
          endDate
          endTime
          startDate
          startTime
        }
      }
      ticket {
        id
        subject
        body
        addDate
        comments {
          userID
          body
          addDate
        }
      }
    }
  }
  user(userID: $userID) {
    userID
    username
    email
    phone
    signature
    initials
    autoRenewContracts
    subscribeToMobileNotifications
    isActive
    isPasswordExpired
  }
}
`;