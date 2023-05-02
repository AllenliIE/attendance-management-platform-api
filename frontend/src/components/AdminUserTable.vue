<template>
  <AppSpinner v-if="isLoading" />
  <table v-else class="table table-hover table-bordered text-center">
    <thead class="table-light">
      <tr class="table-info" style="font-size: 24px">
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
        <th scope="col">Is Locked</th>
        <th scope="col">Button</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id" style="font-size: 20px">
        <td scope="row">
          {{ user.id }}
        </td>
        <td>
          {{ user.name }}
        </td>
        <td>
          {{ user.email }}
        </td>
        <td>
          {{ user.role }}
        </td>
        <td>
          {{ user.isLocked ? "Yes" : "No" }}
        </td>
        <td>
          <button
            v-if="user.isLocked"
            class="btn btn-danger btn-sm"
            @click="putIsLocked(user)"
            :disabled="isProcessing"
          >
            None IsLocked
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import adminAPI from "./../apis/admin";
import AppSpinner from "./../components/AppSpinner";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "./../utils/helpers";

export default {
  name: "AdminUserTable",
  components: {
    AppSpinner,
  },
  setup() {
    const router = useRouter();
    const users = ref([]);
    const isLoading = ref(false);
    const isProcessing = ref(false);

    async function fetchUsers() {
      isLoading.value = true;
      isProcessing.value = true;

      try {
        const { data } = await adminAPI.users.getUsers();
        if (data.status === "error") {
          throw new Error(data.message);
        }

        users.value = data;
        isLoading.value = false;
        isProcessing.value = false;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得人員清單！",
        });
        isLoading.value = false;
        isProcessing.value = false;
      }
    }

    async function putIsLocked(userId) {
      isLoading.value = true;
      isProcessing.value = true;

      try {
        const { data } = await adminAPI.users.putIsLocked(userId.id);
        if (data.status === "error") {
          throw new Error(data.message);
        } else if (data.status === "success") {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        }
        router.push("/admin/attendance/users").then(() => {
          isLoading.value = false;
          isProcessing.value = false;
          location.reload();
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
        isLoading.value = false;
        isProcessing.value = false;
      }
    }
    fetchUsers();
    return {
      users,
      putIsLocked,
      isLoading,
      isProcessing,
    };
  },
};
</script>
