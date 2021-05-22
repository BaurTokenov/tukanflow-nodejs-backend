import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config()

export const { MONGO_URL } = process.env
export const { PASSPORT_KEY } = process.env
export const { AllowedUrls } = process.env
export const { NODE_ENV } = process.env
export const { ACCESS_TOKEN } = "eyJ0eXAiOiJKV1QiLCJub25jZSI6ImVMTlB4dFlyNzJRQ1gxWXhWaGlQOE5pTmFrNXZ2cDhCd0s1Y1g5U1M3RlkiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MmJiYzcwZi03MWQwLTRlYjMtOWI2ZS1lMjA5MWFiOTIwOWIvIiwiaWF0IjoxNjIxNjk3MjExLCJuYmYiOjE2MjE2OTcyMTEsImV4cCI6MTYyMTcwMTExMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFRBQUFBTm5rdGdxNVQzejRlN2liWklOeWJUODdPK2ovb2VxZWF5cHZPd2JRQmtVST0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIChvZmZpY2lhbCBzaXRlKSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJUYWxpcG92IiwiZ2l2ZW5fbmFtZSI6IkFudWFyIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOC4zOC4xNzIuNDUiLCJuYW1lIjoiQW51YXIgVGFsaXBvdiIsIm9pZCI6ImUyYmFhYzU0LWU1NzItNGU1NS1hZjIyLTNmNjUzYjRhZjRmZSIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMTQ0RTMwMTY4IiwicmgiOiIwLkFYRUFEOGU3a3RCeHMwNmJidUlKR3JrZ203WElpOTc1MmJGSXFLMjNTTnB5VUdSeEFNMC4iLCJzY3AiOiJvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwiLCJzdWIiOiI3YlpiaGtHWHdrdHNVaVYwU1VsbldvZ0ZxcHVHckNZOWdVaFFJaXNmWlFRIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiOTJiYmM3MGYtNzFkMC00ZWIzLTliNmUtZTIwOTFhYjkyMDliIiwidW5pcXVlX25hbWUiOiJhbnVhckB0dWthbmdhbWJpdC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhbnVhckB0dWthbmdhbWJpdC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJKOUY1TjM3cS1FT1FfcEkzUzhjakFRIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6Ik0tYUlidlU1aE1fc0ZXWDlneWJoYUZ1SjQ3cEUyWktJNTIyNk9YU2lKU1UifSwieG1zX3RjZHQiOjE2MjE2OTUyNDB9.IinAmj4jcNolfG8M2NRubgSH0a76WyDI5RHxRtT8Yl8O_z2cj0hsP9n39FR6eW28tGNNuGtEziEGBnDJsvkd6jLz7K4TyuGUo6P3bDxqUlzuCqCukxHvBSuWIStJbzQPrtuY9Vu28hsjvChVPSJcSEZz9DqeOB41XCqikg25_wvdo6FIY7t7LnQ3TGxxUc4E96njQtfZPaCXasmAm0ywJtcE8pu0-xEvWDjluXXe7cfQKjGk_xaye01_79EhXLwBibz5bsBYsJ89vOg16yV_HI7X0kMEgioRiSFG2Y9ZzEF_5cLzu9OCA7C19T3YMX_5EMh4GrCLMKAogvSNgjrQYQ"
export const { GRAPH_URI } = "https://graph.microsoft.com/v1.0"