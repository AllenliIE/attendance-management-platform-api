<template>
  <table class="table table-hover table-bordered text-center">
    <thead class="table-light">
      <tr class="table-info">
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
        <th scope="col">Is Locked</th>
        <th scope="col">Button</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <th scope="row">
          {{ user.id }}
        </th>
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
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter } from "vue-router";

export default {
  name: "AdminUserTable",
  setup() {
    const router = useRouter();
    const isProcessing = ref(false);
    const users = ref([]);

    async function fetchUsers() {
      try {
        const { data } = await adminAPI.users.getUsers();
        if (data.status === "error") {
          throw new Error(data.message);
        }

        users.value = data;
        isProcessing.value = false;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得人員清單！",
        });
        isProcessing.value = false;
      }
    }

    async function putIsLocked(userId) {
      try {
        isProcessing.value = true;
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
          isProcessing.value = false;
          location.reload();
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
        isProcessing.value = false;
      }
    }
    fetchUsers();
    return {
      users,
      putIsLocked,
      isProcessing,
    };
  },
};
</script>
