const BASE_URL = "http://localhost:8080/api/auth";

export async function post(url: string, data?: any) {
  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  return await res.text(); // backend kamu STRING
}