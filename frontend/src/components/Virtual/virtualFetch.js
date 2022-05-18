async function virtualFetch(url, fetchData) {
    const response = await fetch(url, fetchData)

    if (!response.ok) {
        console.log('bug virtualFetch')
    }

    return response.json()
}

export default virtualFetch
