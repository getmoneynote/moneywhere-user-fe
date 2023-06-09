import { request  } from "@umijs/max";
// import {request} from "@/utils/http";

export async function create(prefix, data) {
  return request(prefix, {
    method: 'POST',
    data: data,
  });
}

export async function query(prefix, params) {
  return request(prefix, {
    method: 'GET',
    params: params,
  });
}

export async function update(prefix, id, data) {
  return request(`${prefix}/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function remove(prefix, id) {
  return request(`${prefix}/${id}`, {
    method: 'DELETE',
  });
}

export async function queryAll(prefix, params) {
  return await request(`${prefix}/all`, {
    method: 'GET',
    params: params,
  });
}

export async function toggle(prefix, id) {
  return request(`${prefix}/${id}/toggle`, {
    method: 'PATCH',
  });
}
