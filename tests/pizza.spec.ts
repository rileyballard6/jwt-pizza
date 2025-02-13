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

  await page.goto("http://localhost:5173/");
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
