import type { TokenProps } from "@/types/auth";
import { cookiesSettings } from "@/utils/constants";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { openDB } from "idb";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

const api: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const refreshTokenFunc = async () => {
	const refreshToken = Cookie.get("refreshToken");

	try {
		const rs = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
			{
				refreshToken,
			},
		);

		const { idToken } = rs.data;

		const { exp } = jwtDecode<TokenProps>(idToken);
		Cookie.set("idToken", idToken, cookiesSettings);
		const expiresIn = new Date(exp * 1000).toString();
		Cookie.set("expiresIn", expiresIn, cookiesSettings);
		return idToken as string;
	} catch (error: any) {
		if (
			error &&
			error.response &&
			error.response.data &&
			error.response.data.error === "session-revoked"
		) {
			Cookie.remove("idToken");
			Cookie.remove("refreshToken");
			Cookie.remove("expiresIn");
			Cookie.remove("role");
			Cookie.remove("signed");
			window.location.reload();
		}
	}
};

function saveRequestInLocalStorage(config: any) {
	const offlineRequests =
		JSON.parse(localStorage.getItem("offlineRequests") ?? "[]") || [];
	offlineRequests.push(config);
	localStorage.setItem("offlineRequests", JSON.stringify(offlineRequests));
}

export const getToken = async () => {
	const storedIdToken = Cookie.get("idToken");
	const expiresIn = Cookie.get("expiresIn");

	if (storedIdToken && expiresIn) {
		const now = new Date();
		const exp = new Date(expiresIn);
		if (exp < now) {
			return await refreshTokenFunc();
		}
	}
	return storedIdToken;
};

api.interceptors.request.use(
	async (config) => {
		const token = await getToken();
		if (token) config.headers.Authorization = `Bearer ${token}`;

		if (!navigator.onLine) {
			console.log("offline  - " + config.url);
			const dataJson = JSON.stringify(config.data);
			const configAPI = {
				id: new Date().getTime(),
				url: config.url,
				method: config.method,
				headers: config.headers,
				data: dataJson,
			};

			if (
				config.method === "post" ||
				config.method === "put" ||
				config.method === "delete" ||
				config.method === "POST" ||
				config.method === "PUT" ||
				config.method === "DELETE"
			) {
				saveRequestInLocalStorage(configAPI);
			}

			// Return a Promise that resolves to a fallback response
			return new Promise((resolve) => {
				resolve({
					data: "Offline fallback response",
					headers: config.headers,
				});
			});
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
// api.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     const token = await getToken()
//     config.headers.Authorization = `Bearer ${token}`
//     return config
//   },
//   async (error) => {
//     // create a cache to store the failed requests and the data, use localstorage or something like idb to store the data
//
//     return Promise.reject(error)
//   },
// )
// //
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			((error.response?.status === 401 &&
				!originalRequest.url?.includes("auth")) ||
				error.response?.data?.message === "jwt expired") &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			try {
				const idToken = await refreshTokenFunc();
				originalRequest.headers.Authorization = `Bearer ${idToken}`;
				return api(originalRequest);
			} catch (error) {
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	},
);
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     const originalRequest = error.config
//     console.log('error', error)
//
//     if (
//       ((error.response?.status === 401 &&
//         !originalRequest.url?.includes('auth')) ||
//         error.response?.data?.message === 'jwt expired') &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true
//       try {
//         const idToken = await refreshTokenFunc()
//         originalRequest.headers.Authorization = `Bearer ${idToken}`
//         return api(originalRequest)
//       } catch (error) {
//         return Promise.reject(error)
//       }
//     }
//     return Promise.reject(error)
//   },
// )

export default api;
