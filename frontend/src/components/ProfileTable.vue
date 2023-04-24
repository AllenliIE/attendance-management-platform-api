<template>
  <form class="w-50 text-primary m-auto" @submit.prevent.stop="handleSubmit">
    <div class="d-flex justify-content-center text-center mb-4">
      <i class="fa-solid fa-address-card fa-3x m-3"></i>
      <p class="mb-3 font-weight-normal" style="font-size: 48px">
        <strong> Profile Page </strong>
      </p>
    </div>
    <div
      class="form-label-group m-auto text-muted text-start mb-2"
      style="width: 400px; font-size: 24px"
    >
      <label for="name">
        <strong> Name </strong>
      </label>
      <input
        id="name"
        v-model="userForm.name"
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
      style="width: 400px; font-size: 24px"
    >
      <label for="email">
        <strong> Email </strong>
      </label>
      <input
        id="email"
        v-model="userForm.email"
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
      style="width: 400px; font-size: 24px"
    >
      <label for="account">
        <strong> Account </strong>
      </label>
      <input
        id="account"
        v-model="userForm.account"
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
      style="width: 400px; font-size: 24px"
    >
      <label for="password">
        <strong> Password </strong>
      </label>
      <input
        id="password"
        v-model="userForm.password"
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
      style="width: 400px; font-size: 24px"
    >
      <label for="password-check">
        <strong> Password Check </strong>
      </label>
      <input
        id="password-check"
        v-model="userForm.passwordCheck"
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
        class="btn btn-lg btn-primary btn-block mb-3"
        type="submit"
        :disabled="isProcessing"
        style="font-size: 24px; width: 200px"
      >
        <strong> {{ isProcessing ? "Processing..." : "Change" }}</strong>
      </button>
    </div>
  </form>
</template>

<script>
import usersAPI from "./../apis/users";

import { Toast } from "./../utils/helpers";
import { ref, reactive, computed, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "ProfileTable",
  setup() {
    const router = useRouter();
    const store = useStore();
    const currentUser = computed(() => store.state.currentUser);

    const isProcessing = ref(false);

    const userForm = reactive({
      ...toRefs(currentUser.value),
      password: "",
      passwordCheck: "",
    });

    async function handleSubmit() {
      isProcessing.value = true;

      try {
        const data = await usersAPI.putProfile({
          UserId: store.getters.userId,
          formData: userForm,
        });

        if (data.status === "error") {
          throw new Error(data.message);
        } else {
          Toast.fire({
            icon: "success",
            title: "更新成功！",
          });
        }

        router.push(`/clocking/user/${store.getters.userId}`).then(() => {
          isProcessing.value = false;
          location.reload();
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法更新使用者資料，請稍後再試！",
        });
        isProcessing.value = false;
      }
    }

    return {
      userForm,
      isProcessing,
      handleSubmit,
    };
  },
};
</script>
