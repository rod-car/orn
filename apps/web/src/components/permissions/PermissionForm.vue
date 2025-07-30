<template>
  <form @submit.prevent="handleSumbit">
    <div class="row">
      <div v-if="props.newData" class="col-xl-12 mb-3">
        <Input v-model="permission.name" :error="errors.name" :required="props.newData ? true : false"
          :readonly="!props.newData ? true : false">Nom</Input>
      </div>
      <div v-else class="col-xl-12 mb-3">
        <label class="form-label">Nom</label>
        <label class="form-control">{{ permission.name }}</label>
      </div>

      <div class="col-xl-12 mb-3">
        <Textarea v-model="permission.description" :error="errors.description" :required="true">Description</Textarea>
      </div>

      <div class="d-flex justify-content-end">
        <Button color="danger" :to="{ name: 'permission.list' }" class="me-3">
            Fermer
            <i class="fa fa-close me-1"></i>
        </Button>
        <Button type="submit" color="success" :loading="processing" :disabled="!canSubmit">
          <i class="fa fa-save me-1"></i>
          Enregistrer
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup>
import Button from "@/components/buttons";
import { Input, Textarea } from "@/components/fields";
import { usePermissionStore } from "@/stores";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  newData: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const permissionStore = usePermissionStore();
const { permission, errors, processing } = storeToRefs(permissionStore);

if (props.newData === true)
  permission.value = {
    name: "",
    description: "",
  };

const handleSumbit = async () => {
  let response = false;
  if (props.newData === true) {
    response = await permissionStore.create();
  } else {
    response = await permissionStore.update(permission.value.id);
  }
  if(Object.keys(errors.value ?? {}).length === 0) {
    emit("permission-created");
    router.push({ name: 'permission.list' });
  }
};

const emit = defineEmits({
  "permission-created": true,
});

/**
 * Allows disabling the button in case the fields are empty.
 */
const canSubmit = computed(() => {
  return permission.value.name !== "" && permission.value.description !== "";
});
</script>
