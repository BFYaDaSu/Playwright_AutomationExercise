import { test, expect } from "@playwright/test";
const testDataLogin = {
  Data: {
    FirstName: "TestFN",
    LastName: "TestLN",
    Email: "TestUser999@gmail.com",
    Password: "Password",
    Number: "613-248-7640",
  },
  checkPage: {
    Register: "New User Signup!",
    RegisterSuccess: "Account Created!",
    DeleteAccount: "Account Deleted!",
  },
  IncorrectData: {
    Email: "IncorrectData@gmail.com",
    Password: "IncorrectPassword",
  },
};

async function fillAddress(page) {
  await page.fill('[data-qa="company"]', "TestCompany");
  await page.fill('[data-qa="address"]', "405 Bank St");
  await page.selectOption('[data-qa="country"]', "Canada");
  await page.fill('[data-qa="state"]', "Ontario");
  await page.fill('[data-qa="city"]', "Ottawa");
  await page.fill('[data-qa="zipcode"]', "K1H 7Z1");
}

test.beforeEach(async ({ page }) => {
  await page.goto("https://automationexercise.com/");
});

// Register
async function registerUser(page) {
  await page.locator('text="Signup / Login"').click();
  await expect(page).toHaveURL("https://automationexercise.com/login");

  await page
    .locator('[data-qa="signup-name"]')
    .fill(testDataLogin.Data.FirstName + " " + testDataLogin.Data.LastName);
  await page.locator('[data-qa="signup-email"]').fill(testDataLogin.Data.Email);
  await page.locator('[data-qa="signup-button"]').click();

  await page.locator(':nth-child(4) > .top input[type="radio"]').check();
  await page.getByLabel("Password *").fill(testDataLogin.Data.Password);

  // BirthDate
  await page.selectOption('[data-qa="days"]', "11");
  await page.selectOption('[data-qa="months"]', "March");
  await page.selectOption('[data-qa="years"]', "2003");

  await page.locator("#newsletter").check();
  await page.locator("#optin").check();

  await page
    .locator('[data-qa="first_name"]')
    .fill(testDataLogin.Data.FirstName);
  await page.locator('[data-qa="last_name"]').fill(testDataLogin.Data.LastName);
  await fillAddress(page);
  await page
    .locator('[data-qa="mobile_number"]')
    .fill(testDataLogin.Data.Number);
  await page.locator('[data-qa="create-account"]').click();

  await expect(page.locator("b")).toHaveText(
    testDataLogin.checkPage.RegisterSuccess
  );
  await page.locator('[data-qa="continue-button"]').click();
  await expect(page.locator("text=Logged in")).toBeVisible();
}

// Login
async function login(page) {
  await page.locator('[data-qa="login-email"]').fill(testDataLogin.Data.Email);
  await page
    .locator('[data-qa="login-password"]')
    .fill(testDataLogin.Data.Password);
  await page.locator('[data-qa="login-button"]').click();
  await expect(page.locator("text=Logged in")).toBeVisible();
}

//DeleteAccount;
async function deleteAccount(page) {
  await page.locator('text="Delete Account"').click();
  await expect(page.locator("b")).toHaveText(
    testDataLogin.checkPage.DeleteAccount
  );
}

test("TC01", async ({ page }) => {
  //Register
  await registerUser(page);

  //Logout
  //   await logout(page);

  //Register User with existing email
  //   await page
  //     .locator('[data-qa="signup-name"]')
  //     .fill(testDataLogin.Data.FirstName + " " + testDataLogin.Data.LastName);
  //   await page.locator('[data-qa="signup-email"]').fill(testDataLogin.Data.Email);
  //   await page.locator('[data-qa="signup-button"]').click();
  //   await expect(page.locator("text=Email Address already exist!")).toBeVisible();

  //Login with incorrect email and password
  //   await page
  //     .locator('[data-qa="login-email"]')
  //     .fill(testDataLogin.IncorrectData.Email);
  //   await page
  //     .locator('[data-qa="login-password"]')
  //     .fill(testDataLogin.IncorrectData.Password);
  //   await page.locator('[data-qa="login-button"]').click();
  //   await expect(
  //     page.locator("text=Your email or password is incorrect!")
  //     ).toBeVisible();

  //Login with correct email and password
  // await login(page);

  await page.locator('text="Home"').click();

  // Recommended items
  await expect(page.locator(".recommended_items > .title")).toBeVisible();

  await page.click(
    ".active > :nth-child(3) > .product-image-wrapper > .single-products > .productinfo > .btn"
  );
  await page.click("text=View Cart");
  await page.click("text=Products");

  //Search
  await page.fill("#search_product", "top");
  await page.click("#submit_search");

  await page.waitForTimeout(3000);
  await page.click(
    ":nth-child(4) > .product-image-wrapper > .choose > .nav > li > a"
  );
  await expect(page).toHaveURL(/.*\/product_details/);
  await page.click(":nth-child(5) > .btn"); // Add to cart
  await page.click(".modal-footer > .btn");
  await page.click("text=Women");
  await page.click("text=Saree");
  await page.click(
    ":nth-child(3) > .product-image-wrapper > .choose > .nav > li > a"
  );

  //Brand
  await page.click("text=Polo");
  await page.click(
    ":nth-child(5) > .product-image-wrapper > .choose > .nav > li > a"
  );
  await page.click(":nth-child(5) > .btn");
  await page.click("text=Continue Shopping");

  //Cart
  await page.click(".shop-menu > .nav > :nth-child(3) > a");
  await page.click("text=Proceed To Checkout");

  await page.click("text=Place Order");

  await page.fill(
    '[data-qa="name-on-card"]',
    `${testDataLogin.Data.FirstName} ${testDataLogin.Data.LastName}`
  );
  await page.fill('[data-qa="card-number"]', "1");
  await page.fill('[data-qa="cvc"]', "111");
  await page.fill('[data-qa="expiry-month"]', "11");
  await page.fill('[data-qa="expiry-year"]', "2027");

  await page.click("text=Pay and Confirm Order");
  await page.click("text=Download Invoice");

  await deleteAccount(page);
});
