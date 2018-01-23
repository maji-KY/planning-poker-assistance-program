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

#### OrganizationAdmissions
/organizations/{**organizationId**}/admissions/{**userId**}

#### Groups
/organizations/{**organizationId**}/groups/{**groupId**}
- name: string
- topic: string
- allReady: boolean
- antiOpportunism: boolean

#### GroupUsers
/groups/{**groupId**}/users/{**userId**}
- userId: string
- rightToTalk: boolean
- ready: boolean
- trump: string

### Data Relations
- Organizations <- OrganizationUsers
- Groups <- GroupUsers
