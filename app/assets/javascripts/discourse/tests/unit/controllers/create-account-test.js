import { test } from "qunit";
import I18n from "I18n";
import { discourseModule } from "discourse/tests/helpers/qunit-helpers";

discourseModule("Unit | Controller | create-account", function () {
  test("basicUsernameValidation", async function (assert) {
    const testInvalidUsername = async function (username, expectedReason) {
      const controller = await this.owner.lookup("controller:create-account");
      controller.set("accountUsername", username);

      assert.equal(
        controller.get("basicUsernameValidation.failed"),
        true,
        "username should be invalid: " + username
      );
      assert.equal(
        controller.get("basicUsernameValidation.reason"),
        expectedReason,
        "username validation reason: " + username + ", " + expectedReason
      );
    }.bind(this);

    testInvalidUsername("", undefined);
    testInvalidUsername("x", I18n.t("user.username.too_short"));
    testInvalidUsername(
      "123456789012345678901",
      I18n.t("user.username.too_long")
    );

    const controller = await this.owner.lookup("controller:create-account");
    controller.setProperties({
      accountUsername: "porkchops",
      prefilledUsername: "porkchops",
    });

    assert.equal(
      controller.get("basicUsernameValidation.ok"),
      true,
      "Prefilled username is valid"
    );
    assert.equal(
      controller.get("basicUsernameValidation.reason"),
      I18n.t("user.username.prefilled"),
      "Prefilled username is valid"
    );
  });

  test("passwordValidation", async function (assert) {
    const controller = await this.owner.lookup("controller:create-account");

    controller.set("authProvider", "");
    controller.set("accountEmail", "pork@chops.com");
    controller.set("accountUsername", "porkchops");
    controller.set("prefilledUsername", "porkchops");
    controller.set("accountPassword", "b4fcdae11f9167");

    assert.equal(
      controller.get("passwordValidation.ok"),
      true,
      "Password is ok"
    );
    assert.equal(
      controller.get("passwordValidation.reason"),
      I18n.t("user.password.ok"),
      "Password is valid"
    );

    const testInvalidPassword = (password, expectedReason) => {
      controller.set("accountPassword", password);

      assert.equal(
        controller.get("passwordValidation.failed"),
        true,
        "password should be invalid: " + password
      );
      assert.equal(
        controller.get("passwordValidation.reason"),
        expectedReason,
        "password validation reason: " + password + ", " + expectedReason
      );
    };

    testInvalidPassword("", undefined);
    testInvalidPassword("x", I18n.t("user.password.too_short"));
    testInvalidPassword("porkchops", I18n.t("user.password.same_as_username"));
    testInvalidPassword(
      "pork@chops.com",
      I18n.t("user.password.same_as_email")
    );
  });

  test("authProviderDisplayName", async function (assert) {
    const controller = this.owner.lookup("controller:create-account");

    assert.equal(
      controller.authProviderDisplayName("facebook"),
      I18n.t("login.facebook.name"),
      "provider name is translated correctly"
    );

    assert.equal(
      controller.authProviderDisplayName("idontexist"),
      "idontexist",
      "provider name falls back if not found"
    );
  });
});
