import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("/");

  expect(await page.title()).toBe("JWT Pizza");
});

//Buy Pizza with Login
test("buy pizza with login", async ({ page }) => {
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
      {
        id: 3,
        title: "Margarita",
        image: "pizza3.png",
        price: 0.0042,
        description: "Essential classic",
      },
      {
        id: 4,
        title: "Crusty",
        image: "pizza4.png",
        price: 0.0028,
        description: "A dry mouthed favorite",
      },
      {
        id: 5,
        title: "Charred Leopard",
        image: "pizza5.png",
        price: 0.0099,
        description: "For those with a darker side",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route("*/**/api/auth", async (route) => {
    const loginReq = {
      email: "d@jwt.com",
      password: "diner",
    };
    const loginRes = {
      user: {
        id: 2,
        name: "pizza diner",
        email: "d@jwt.com",
        roles: [
          {
            role: "diner",
          },
        ],
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InBpenphIGRpbmVyIiwiZW1haWwiOiJkQGp3dC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpYXQiOjE3Mzk0MDQ4NjF9.NO7WTKHU4oMzAfgPOh0vwfgNjY5IrAsihIam5xKxcmM",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseRes = [
      {
        id: 1,
        name: "pizzaPocket",
        stores: [
          {
            id: 1,
            name: "SLC",
          },
        ],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Order now" }).click();
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("1");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!"
  );
  await expect(page.locator("tbody")).toContainText("Veggie");
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByRole("main")).toContainText("0.008 ₿");
});

test("Log in as Franchisee and Make Store", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = {
      email: "f@jwt.com",
      password: "franchisee",
    };
    const loginRes = {
      user: {
        id: 3,
        name: "pizza franchisee",
        email: "f@jwt.com",
        roles: [
          {
            role: "diner",
          },
          {
            objectId: 1,
            role: "franchisee",
          },
        ],
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzM5NDA1NjMyfQ.DmO84togM8jwGUwWgVvgzwVVcrB4n_ubQoiFhcOFQ5Y",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise/1/store", async (route) => {
    const request = {
      id: "",
      name: "Store",
    };

    const response = {
      id: "",
      franchiseId: 1,
      name: "Store",
    };
    expect(route.request().method()).toBe("POST");
  });

  await page.route("*/**/api/franchise/3", async (route) => {
    const getResult = [
      {
        id: 1,
        name: "pizzaPocket",
        admins: [
          {
            id: 3,
            name: "pizza franchisee",
            email: "f@jwt.com",
          },
        ],
        stores: [
          {
            id: 1,
            name: "SLC",
            totalRevenue: 0.0842,
          },
          {
            id: 3,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 4,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 5,
            name: "Store",
            totalRevenue: 0,
          },
        ],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: getResult });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("f@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("franchisee");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("list")).toContainText("franchise-dashboard");
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("Store");
  await page.getByRole("button", { name: "Create" }).click();
});

test("Create and Delete Franchie", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = {
      email: "a@jwt.com",
      password: "admin",
    };
    const loginRes = {
      user: {
        id: 1,
        name: "常用名字",
        email: "a@jwt.com",
        roles: [
          {
            role: "admin",
          },
        ],
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM5NDA2NTc3fQ.wiqeLGoJlskqWRH-mq4CbWYppuFJsx4udyezfXy3Khc",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const getResult = [
      {
        id: 1,
        name: "pizzaPocket",
        admins: [
          {
            id: 3,
            name: "pizza franchisee",
            email: "f@jwt.com",
          },
        ],
        stores: [
          {
            id: 1,
            name: "SLC",
            totalRevenue: 0.1402,
          },
          {
            id: 3,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 5,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 8,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 9,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 10,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 11,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 12,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 13,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 14,
            name: "Store",
            totalRevenue: 0,
          },
          {
            id: 15,
            name: "Store",
            totalRevenue: 0,
          },
        ],
      },
    ];

    const postResult = {
      stores: [],
      id: 4,
      name: "Franchise Name",
      admins: [
        {
          email: "d@jwt.com",
          id: 2,
          name: "pizza diner",
        },
      ],
    };
    if (route.request().method() == "GET") {
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: getResult });
    } else {
      expect(route.request().method()).toBe("POST");
      await route.fulfill({ json: postResult });
    }
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button").filter({ hasText: /^$/ }).click();
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await expect(page.getByRole("heading")).toContainText("Create franchise");
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Franchise Name");
  await page.getByRole("textbox", { name: "franchise name" }).press("Tab");
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("d@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("row").getByRole("button").nth(-1).click();
  await expect(page.getByRole("heading")).toContainText("Sorry to see you go");
  await page.getByRole("button", { name: "Close" }).click();
});

test("Explore random pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?"
  );
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
});

test("Register and logout", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const registerReq = {
      name: "User",
      email: "u@jwt.com",
      password: "user",
    };
    const loginRes = {
      user: {
        name: "User",
        email: "u@jwt.com",
        roles: [
          {
            role: "diner",
          },
        ],
        id: 6,
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVXNlciIsImVtYWlsIjoidUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjYsImlhdCI6MTczOTQwODM4OH0.QnB-nUUAvvu11V-HPgbalvKMlVIc2FNRb2TVDyyMcCM",
    };
    if (route.request().method() == "POST") {
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: loginRes });
    } else {
      expect(route.request().method()).toBe("DELETE");
    }
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("User");
  await page.getByRole("textbox", { name: "Full name" }).press("Tab");
  await page.getByRole("textbox", { name: "Email address" }).fill("u@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("user");
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("link", { name: "Logout" }).click();
});

test("Diner Dashboard", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = {
      email: "d@jwt.com",
      password: "diner",
    };
    const loginRes = {
      user: {
        id: 1,
        name: "pizza diner",
        email: "d@jwt.com",
        roles: [
          {
            role: "diner",
          },
        ],
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM5NDA2NTc3fQ.wiqeLGoJlskqWRH-mq4CbWYppuFJsx4udyezfXy3Khc",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "pd" }).click();
  await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");

  await page.goto("/randompage");
  await expect(page.getByRole("heading")).toContainText("Oops");
  await expect(page.getByRole("main")).toContainText(
    "It looks like we have dropped a pizza on the floor. Please try another page."
  );
});
