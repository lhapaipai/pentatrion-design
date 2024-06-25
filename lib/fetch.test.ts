import { afterEach, describe, test, vi } from "vitest";
import { fetchAPI } from "./fetch";

function get200Response() {
  return {
    status: 200,
    ok: true,
    headers: new Headers(),
    text() {
      return Promise.resolve("hello world");
    },
  };
}

describe("fetchAPI", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("accept relative url", async ({ expect }): Promise<void> => {
    const mock = vi.fn().mockResolvedValueOnce(get200Response());

    vi.stubGlobal("fetch", mock);

    const result = await fetchAPI("/hello");

    expect(mock).toBeCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("http://localhost:3000/hello", {});
    expect(result).toBe("hello world");
  });

  test("parse urlParams", async ({ expect }): Promise<void> => {
    const mock = vi.fn().mockResolvedValue(get200Response());

    vi.stubGlobal("fetch", mock);

    await fetchAPI("/user/{name}/{id}", {
      urlParams: {
        name: "dupond",
        id: 3,
      },
    });

    expect(mock).toHaveBeenCalledWith("http://localhost:3000/user/dupond/3", {});

    await fetchAPI("/user/{name}/{id}", {
      urlParams: {
        name: "dupond",
      },
    });

    expect(mock).toHaveBeenCalledWith("http://localhost:3000/user/dupond/%7Bid%7D", {});

    await fetchAPI("/user/{name}/{id}", {
      urlParams: {
        name: "dupond",
        id: 3,
        lastname: "dupont",
      },
    });

    expect(mock).toHaveBeenCalledWith("http://localhost:3000/user/dupond/3", {});
  });

  test("parse query", async ({ expect }): Promise<void> => {
    const mock = vi.fn().mockResolvedValue(get200Response());

    vi.stubGlobal("fetch", mock);

    await fetchAPI("/user", {
      query: {
        name: "dupond",
        id: 3,
      },
    });
    expect(mock).toHaveBeenCalledWith("http://localhost:3000/user?name=dupond&id=3", {});

    await fetchAPI("/user?page=1#hash", {
      query: {
        name: "dupond",
        id: 3,
      },
    });
    expect(mock).toHaveBeenCalledWith(
      "http://localhost:3000/user?page=1&name=dupond&id=3#hash",
      {},
    );
  });

  test("stringify json object", async ({ expect }): Promise<void> => {
    const mock = vi.fn().mockResolvedValue(get200Response());

    vi.stubGlobal("fetch", mock);
    await fetchAPI("/user", {
      body: {
        name: "dupond",
        id: 3,
      },
    });
    expect(mock).toHaveBeenCalledWith("http://localhost:3000/user", {
      body: '{"name":"dupond","id":3}',
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
});
