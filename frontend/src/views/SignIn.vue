<template>
  <div
    class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
    style="height: 800px; margin-top: 200px"
  >
    <form class="w-50 text-primary m-auto" @submit.prevent.stop="handleSubmit">
      <div class="d-flex justify-content-center text-center mb-4">
        <i class="fa-solid fa-industry fa-2xl m-3"></i>
        <p class="mb-3 font-weight-normal" style="font-size: 48px">
          <strong> Sign In </strong>
        </p>
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-2"
        style="width: 400px; font-size: 24px"
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
          autofocus
        />
      </div>

      <div
        class="form-label-group m-auto text-muted text-start mb-3"
        style="width: 400px; font-size: 24px"
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
          autocomplete="current-password"
          required
        />
      </div>
      <div class="d-flex justify-content-center p-0" style="margin-top: 50px">
        <button
          class="btn btn-lg btn-primary btn-block mb-3"
          type="submit"
          :disabled="isProcessing"
          style="font-size: 24px; width: 200px"
        >
          <strong> Submit </strong>
        </button>
      </div>

      <div class="text-center mt-3">
        <p>
          <router-link
            to="/signup"
            class="text-primary"
            style="font-size: 24px"
          >
            <strong> Sign Up </strong>
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

export default {
  setup() {
    const account = ref("");
    const password = ref("");

    function handleSubmit() {
      const data = JSON.stringify({
        account: this.email,
        password: this.password,
      });
      console.log("data", data);
    }
    return { account, password, handleSubmit };
  },
};
</script>
