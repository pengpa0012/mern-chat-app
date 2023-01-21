export const sortDate = (dates) => {
 return dates?.sort(function(a, b) {
    return new Date(a).createdAt - new Date(b).createdAt
  })
}

export const formatDate = (date) => {
  return new Date(date)?.toLocaleString('default', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
}

// export const queryData = async (url, token) => {
//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'x-access-token': token
//   }})
//   return response.json()
// }