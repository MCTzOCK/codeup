/**
 * apps/web/src/global/server/nproxymgr.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.2024
 *
 */

export class NProxyMGR {
  public token: string = "";
  public url: string = process.env.NPROXYMGR_ENDPOINT as string;

  constructor() {}

  public async getToken() {
    const res = await fetch(this.url + "/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: process.env.NPROXYMGR_USER as string,
        scope: "user",
        secret: process.env.NPROXYMGR_PASSWORD as string,
      }),
    });

    const data = await res.json();

    this.token = data.token;
    return this.token;
  }

  public async createProxy(opts: {
    access_list_id: string;
    advanced_config: string;
    allow_websocket_upgrade: boolean;
    block_exploits: boolean;
    caching_enabled: boolean;
    certificate_id: number;
    domain_names: string[];
    forward_host: string;
    forward_port: number;
    forward_scheme: string;
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
    http2_support: boolean;
    locations: any[];
    meta: {
      dns_challenge: boolean;
      letsencrypt_agree: boolean;
    };
    ssl_forced: boolean;
  }) {
    const res = await fetch(this.url + "/api/nginx/proxy-hosts", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(opts),
    });

    if (![200, 201].includes(res.status)) {
      return false;
    }

    return true;
  }

  public async existsProxy(domain: string): Promise<number> {
    const res = await fetch(this.url + "/api/nginx/proxy-hosts", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    for (const proxy of data) {
      if (proxy.domain_names.includes(domain)) {
        return proxy.id;
      }
    }

    return -1;
  }

  public async deleteProxy(id: number) {
    const res = await fetch(this.url + "/api/nginx/proxy-hosts/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      return false;
    }

    return true;
  }
}
