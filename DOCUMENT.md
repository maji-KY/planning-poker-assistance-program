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

#### Groups
/organizations/{**organizationId**}/groups/{**groupId**}
- name: string
- topic: string
- allReady: boolean

#### GroupUsers
/groups/{**groupId**}/user/{**userId**}
- rightToTalk: boolean

#### Trump
/groups/{**groupId**}/trump/{**userId**}
- trump: string

### Data Relations
- Organizations <- OrganizationUsers
- Groups <- GroupUsers
