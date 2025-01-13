# API Documentation

## Base URL
All routes are prefixed with `/api`.

---

## Endpoints

### **Subscriptions**

#### **Save**

**POST** `/subs/save`

This endpoint allows you to save a subscription.

##### Request
- **Content-Type**: `application/json`

###### Body Parameters:
| Field    | Type   | Required | Description                  |
|----------|--------|----------|------------------------------|
| `userId` | String | Yes      | The unique ID of the user.   |
| `token`  | String | Yes      | The token associated with the user. |

##### Example Request
```json
POST /api/subs/save
{
  "userId": "12345",
  "token": "abcd1234"
}
```

##### Response
- **Success**: 200 OK
  ```json
  {
    "message": "Subscription saved successfully."
  }
  ```
- **Failure**: 400 Bad Request (Missing fields or invalid data)
  ```json
  {
    "error": "Missing or invalid parameters."
  }
  ```

#### **Delete**

**DELETE** `/subs/delete`

This endpoint allows you to delete a subscription.

##### Request
- **Content-Type**: `application/json`

###### Body Parameters:
| Field    | Type   | Required | Description                  |
|----------|--------|----------|------------------------------|
| `userId` | String | Yes      | The unique ID of the user.   |

##### Example Request
```json
DELETE /api/subs/delete
{
  "userId": "12345"
}
```

##### Response
- **Success**: 200 OK
  ```json
  {
    "message": "Subscription deleted successfully."
  }
  ```
- **Failure**: 400 Bad Request (Missing or invalid data)
  ```json
  {
    "error": "Missing or invalid parameters."
  }
  ```

---

### **Account Management**

#### **Transfer**

**PUT** `/account/transfer/:from_id/:to_id`

This endpoint allows you to transfer funds between accounts.

##### URL Parameters:
| Parameter | Type   | Required | Description                            |
|-----------|--------|----------|----------------------------------------|
| `from_id` | String | Yes      | The account number of the sender.      |
| `to_id`   | String | Yes      | The account number of the recipient.   |

##### Request
- **Headers**: 
  - `Authorization`: Bearer token
- **Content-Type**: `application/json`

###### Body Parameters:
| Field              | Type   | Required | Description                                  |
|--------------------|--------|----------|----------------------------------------------|
| `password`         | String | Yes      | The password of the sender's account.        |
| `pin`              | String | Yes      | The transaction PIN of the sender.           |
| `balanceTransfered`| Number | Yes      | The amount to transfer.                      |
| `bankCode`         | String | Yes      | The bank code of the recipient's bank.       |
| `narration`        | String | No       | Optional message or description of transfer. |

##### Example Request
```json
PUT /api/account/transfer/1234567890/4449967890
Headers: {
  "Authorization": "Bearer abcd1234"
}
{
  "password": "userpassword",
  "pin": "1234",
  "balanceTransfered": 1000,
  "bankCode": "001",
  "narration": "Payment for services"
}
```
A Successful transfer should trigger notifications being sent, but for push notification, the device token needs to be saved as from the `/api/subs/save` route

##### Response
- **Success**: 200 OK
  ```json
  {
    "message": "Transfer completed successfully."
  }
  ```
- **Failure**: 400 Bad Request (Missing fields or invalid data)
  ```json
  {
    "error": "Missing or invalid parameters."
  }
  ```

#### **Generate Account Number**

**PUT** `/account/generateAcctNo/:clientId`

This endpoint generates a new account number for a client.

##### URL Parameters:
| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `clientId`| String | Yes      | The unique ID of the client. |

##### Request
- **Content-Type**: `application/json`

##### Example Request
```json
PUT /api/account/generateAcctNo/12345
```

##### Response
- **Success**: 200 OK
  ```json
  {
    "acctName": "Account name",
    "accountNo": "9876543210"
  }
  ```
- **Failure**: 400 Bad Request (Missing fields or invalid data)
  ```json
  {
    "error": "Missing or invalid parameters."
  }
  ```
