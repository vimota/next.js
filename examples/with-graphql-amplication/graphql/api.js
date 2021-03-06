import useFetch from '../lib/useFetch'

function getData(data) {
  if (!data || data.errors) return null
  return data.data
}

function getErrorMessage(error, data) {
  if (error) return error.message
  if (data && data.errors) {
    return data.errors[0].message
  }
  return null
}

/**
|--------------------------------------------------
| This GraphQL query returns an array of Guestbook
| entries complete with both the provided and implicit
| data attributes.
|
| Learn more about GraphQL: https://graphql.org/learn/
|--------------------------------------------------
*/
export const useGuestbookEntries = () => {
  const query = `query GuestbookEntries {
    guestbookEntries {
        id
        createdAt
        twitterHandle
        story
    }
  }`
  const size = 100
  const { data, error } = useFetch(
    process.env.NEXT_PUBLIC_AMPLICATION_GRAPHQL_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.NEXT_PUBLIC_AMPLICATION_SECRET}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { size },
      }),
    }
  )

  return {
    data: getData(data),
    errorMessage: getErrorMessage(error, data),
    error,
  }
}

/**
|--------------------------------------------------
| This GraphQL mutation creates a new GuestbookEntry
| with the requisite twitter handle and story arguments.
|
| It returns the stored data and includes the unique
| identifier (id) as well as createdAt (time created).
|
| The guestbook uses the id value as the unique key
| and the createdAt value to sort and display the date of
| publication.
|
| Learn more about GraphQL mutations: https://graphql.org/learn/queries/#mutations
|--------------------------------------------------
*/
export const createGuestbookEntry = async (twitterHandle, story) => {
  const query = `mutation CreateGuestbookEntry($twitterHandle: String!, $story: String!) {
    createGuestbookEntry(data: {
      twitterHandle: $twitterHandle,
      story: $story
    }) {
      id
      createdAt
      twitterHandle
      story
    }
  }`

  const res = await fetch(
    process.env.NEXT_PUBLIC_AMPLICATION_GRAPHQL_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.NEXT_PUBLIC_AMPLICATION_SECRET}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { twitterHandle, story },
      }),
    }
  )
  const data = await res.json()

  return data
}
