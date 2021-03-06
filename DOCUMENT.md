# DESIGN

## Cloud Firestore

### Data Model

#### Users
/users/{**userId**}
- name: string
- iconUrl: string

#### Organizations
/organizations/{**organizationId**}
- name: string

#### UserOrganizations
/UserOrganizations/{**userId**}
- organizationIds: string[]

#### OrganizationJoinRequest
/organizations/{**organizationId**}/joinRequest/{**userId**}

#### Groups
/organizations/{**organizationId**}/groups/{**groupId**}
- name: string
- topic: string
- allReady: boolean
- antiOpportunism: boolean

#### GroupUsers
/organizations/{**organizationId**}/groups/{**groupId**}/users/{**userId**}
- userId: string
- rightToTalk: boolean
- ready: boolean
- trump: string

### Data Relations
- Organizations <- OrganizationUsers
- Groups <- GroupUsers
