import { GraphQLClient } from 'graphql-request'
import getBearerToken from 'utils/getBearerToken'

const client = new GraphQLClient(
  (process.env.NEXT_BACKEND_URL || 'http://localhost:8080') + '/graphql',
  {
    // headers: { authorization: getJwtToken() },
    headers: { authorization: getBearerToken() },
  }
)

interface GraphQLHandle {
  ql: any
  variables?: any
}

// Simplify error handle
export const clientHandle = async (ql, variables) => {
  let data: any = null
  let errors: any = null

  // console.log('param', variables)

  try {
    data = await client.request(ql, variables)
  } catch (error) {
    console.log('error', error)

    errors = error
  }

  return {
    data,
    errors: errors?.response?.errors[0].extensions.response || null,
  }
}

export default client
