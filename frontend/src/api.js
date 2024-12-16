import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/'
});

export const diaryApi = {
    create: (data) => api.post('/diary', data),
    getMonthly: (year, month) => api.get(`/diary/monthly/${year}/${month}`)
};

// 프로필 조회
export async function fetchProfile() {
  const response = await fetch('/api/member/profile', {
    credentials: 'include'
  })
  if (!response.ok) throw new Error('프로필 조회 실패')
  return response.json()
}

// 프로필 수정
export async function updateProfile(data) {
  const response = await fetch('/api/member/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('프로필 수정 실패')
  return response.json()
}
