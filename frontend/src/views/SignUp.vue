<template>
  <div
    class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
    style="height: 800px; margin-top: 200px"
  >
    <form
      class="w-50 col-md-8 text-primary m-auto"
      @submit.stop.prevent="handleSubmit"
    >
      <div class="d-flex justify-content-center text-center mb-4">
        <i class="fa-solid fa-industry fa-2xl m-3"></i>
        <p class="mb-3 font-weight-normaly" style="font-size: 48px">
          <strong> Sign Up </strong>
        </p>
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-2"
        style="font-size: 24px"
      >
        <label for="name">
          <strong> Name </strong>
        </label>
        <input
          id="name"
          v-model="name"
          name="name"
          type="text"
          class="form-control"
          placeholder="name"
          autocomplete="username"
          required
          autofocus
        />
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-2"
        style="font-size: 24px"
      >
        <label for="email">
          <strong> Email </strong>
        </label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="email"
          autocomplete="email"
          required
        />
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-2"
        style="font-size: 24px"
      >
        <label for="account">
          <strong> Account </strong>
        </label>
        <input
          id="account"
          v-model="account"
          name="account"
          type="text"
          class="form-control"
          placeholder="account"
          autocomplete="username"
          required
        />
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-3"
        style="font-size: 24px"
      >
        <label for="password">
          <strong> Password </strong>
        </label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          placeholder="password"
          autocomplete="new-password"
          required
        />
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-3"
        style="font-size: 24px"
      >
        <label for="password-check">
          <strong> Password Check </strong>
        </label>
        <input
          id="password-check"
          v-model="passwordCheck"
          name="passwordCheck"
          type="password"
          class="form-control"
          placeholder="password check"
          autocomplete="new-password"
          required
        />
      </div>
      <div class="d-flex justify-content-center p-0" style="margin-top: 50px">
        <button
          class="btn btn-lg btn-primary btn-block"
          type="submit"
          style="width: 200px; font-size: 24px"
        >
          <strong> Submit </strong>
        </button>
      </div>

      <div class="text-center mt-3">
        <p>
          <router-link
            to="/signin"
            class="text-primary"
            style="font-size: 24px"
          >
            <strong> Sign In </strong>
          </router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center" style="font-size: 16px">
        &copy; 2022-2023
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter } from "vue-router";
import authorizationAPI from "./../apis/authorization";

export default {
  setup() {
    const name = ref("");
    const email = ref("");
    const account = ref("");
    const password = ref("");
    const passwordCheck = ref("");
    const router = useRouter();

    async function handleSubmit() {
      try {
        if (
          !this.name ||
          !this.email ||
          !this.account ||
          !this.password ||
          !this.passwordCheck
        ) {
          Toast.fire({
            icon: "warning",
            title: "請確認完成填寫所有的欄位！",
          });
          return;
        }
        if (this.password !== this.passwordCheck) {
          Toast.fire({
            icon: "warning",
            title: "兩次輸入的密碼不相同！",
          });
          this.passwordCheck = "";
          return;
        }
        const { data } = await authorizationAPI.signUp({
          name: this.name,
          email: this.email,
          account: this.account,
          password: this.password,
          passwordCheck: this.passwordCheck,
        });

        if (data.status === "error") {
          throw new Error(data.message);
        }

        Toast.fire({
          icon: "success",
          title: data.message,
        });

        //back to signIn page.
        router.push("/signin");
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: `無法註冊 - ${error.message}`,
        });
      }
    }

    return { name, email, account, password, passwordCheck, handleSubmit };
  },
};
</script>
