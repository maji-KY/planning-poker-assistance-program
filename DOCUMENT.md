# DESIGN

## Cloud Firestore

### Data Model

#### Users
- id
- name
- iconUrl

#### Organizations
- id
- name

#### OrganizationUsers
- organizationId
- userId

#### Groups
- id
- organizationId
- name
- topic

#### GroupUsers
- groupId
- userId
- trump

### Data Relations
- Organizations <- OrganizationUsers
- Groups <- GroupUsers
