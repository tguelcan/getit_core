# restbest v0.1.4

restBest apiDoc Documentation

- [Auth](#auth)
	- [Authenticate with external provider](#authenticate-with-external-provider)
	
- [Authentication](#authentication)
	- [User Authentication](#user-authentication)
	
- [Entry](#entry)
	- [Create entry](#create-entry)
	- [Delete all entries](#delete-all-entries)
	- [Retrieve user entries](#retrieve-user-entries)
	- [Retrieve entries](#retrieve-entries)
	
- [PasswordReset](#passwordreset)
	- [Send email](#send-email)
	- [Submit password](#submit-password)
	- [Verify token](#verify-token)
	
- [User](#user)
	- [Create user](#create-user)
	- [Delete user](#delete-user)
	- [Retrieve current user](#retrieve-current-user)
	- [Retrieve user](#retrieve-user)
	- [Retrieve users](#retrieve-users)
	- [Update password](#update-password)
	- [Update user](#update-user)
	


# Auth

## Authenticate with external provider



	POST /auth/:provider


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>Facebook user accessToken.</p>							|

# Authentication

## User Authentication



	POST /auth


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>User's email.</p>							|
| password			| String			|  <p>User's password.</p>							|
| token			| String			|  <p>admin access token.</p>							|

# Entry

## Create entry



	POST /entries


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| postcode			| Number			|  							|
| entryType			| String			|  <p>product or service</p>							|
| list			| Array			|  <p>array with objects as modeled in entry schema</p>							|
| deliveryDate			| Date			|  							|
| email			| String			|  <p>user mail</p>							|
| name			| String			|  <p>list name</p>							|

## Delete all entries



	DELETE /entries/all


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| admintoken			| String			|  <p>admin access token.</p>							|

## Retrieve user entries



	GET /entries/me


## Retrieve entries



	GET /entries


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| count			| Number			|  							|
| postcode			| Number			|  							|

# PasswordReset

## Send email



	POST /password-resets


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>Email address to receive the password reset token.</p>							|
| link			| String			|  <p>Link to redirect user.</p>							|

## Submit password



	PATCH /password-resets/:token


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| password			| String			|  <p>User's new password.</p>							|

## Verify token



	GET /password-resets/:token


# User

## Create user



	POST /users


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>Master token.</p>							|
| email			| String			|  <p>User's email.</p>							|
| password			| String			|  <p>User's password.</p>							|
| name			| String			| **optional** <p>User's name.</p>							|
| picture			| String			| **optional** <p>User's picture.</p>							|
| role			| String			| **optional** <p>User's role.</p>							|

## Delete user



	DELETE /users/:id


## Retrieve current user



	GET /users/me


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>User token.</p>							|
| admintoken			| String			|  <p>Admin token.</p>							|

## Retrieve user



	GET /users/:id


## Retrieve users



	GET /users


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>User token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update password



	PATCH /users/:id/password


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>User token.</p>							|
| admintoken			| String			|  <p>Admin token.</p>							|
| password			| String			|  <p>User's new password.</p>							|

## Update user



	PATCH /users/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>User token.</p>							|
| admintoken			| String			|  <p>User token.</p>							|
| name			| String			| **optional** <p>User's name.</p>							|
| picture			| String			| **optional** <p>User's picture.</p>							|
| userSettings			| Object			| **optional** <p>some usersettings values.</p>							|


