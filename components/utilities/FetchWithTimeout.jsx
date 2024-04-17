export async function fetchWithTimeout(urls, timeout = 3000) {
  const fetchPromises = urls.map((url) =>
    Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout while fetching image")),
          timeout
        )
      ),
    ])
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }
        return url;
      })
      .catch((error) => {
        console.error(error);
        return null;
      })
  );

  const responses = await Promise.all(fetchPromises);
  return responses.filter((url) => url !== null);
}
