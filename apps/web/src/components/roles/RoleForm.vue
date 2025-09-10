<template>
    <form method="post">
        <div class="row">
            <div class="col-xl-12 mb-3">
                <Input
                    v-model="role.name"
                    :error="errors.name"
                    required
                >
                    Nom
                </Input>
            </div>

            <div
                v-if="onLoad"
                class="col-xl-12 my-3 text-center"
            >
                Chargement des permissions en cours...
            </div>
            <div
                v-else
                class="col-xl-12 my-3"
            >
                <h2 class="mb-2 text-center">Autorisations</h2>

                <hr class="border-bottom" />

                <div
                    v-for="(permission, permissionIndex) in Object.keys(
                        getFormatedPermissions,
                    )"
                    :key="permissionIndex"
                    class="row"
                >
                    <div class="my-3">
                        <h3
                            class="title mb-3"
                            v-text="translate(permission)"
                        ></h3>

                        <ul class="custom-control-group">
                            <template
                                v-for="(
                                    permissionItem, permissionItemIndex
                                ) in getFormatedPermissions[permission]"
                                :key="permissionItemIndex"
                            >
                                <li>
                                    <CheckboxGrouped
                                        :label="permissionItem.description"
                                        v-model="role.permissions"
                                        :value="permissionItem.id"
                                    />
                                </li>
                            </template>
                        </ul>
                    </div>
                    <hr class="border-bottom" />
                </div>
            </div>
            <span
                v-if="errors.permissions"
                class="text-danger"
            >
                {{ errors.permissions[0] }}
            </span>

            <div
                v-if="!onLoad"
                class="d-flex justify-content-end"
            >
                <Button color="danger" :to="{ name: 'role.list' }" class="me-3">
                    Fermer
                    <i class="fa fa-close me-1"></i>
                </Button>
                <Button
                    :disabled="!canSubmit"
                    @click.prevent="save"
                    :loading="processing"
                    color="success"
                >
                    <i class="fa fa-save me-1"></i>
                    Enregistrer
                </Button>
            </div>
        </div>
    </form>
</template>

<script setup>
import Button from '@/components/buttons'
import { translate } from '@/utils'
import { CheckboxGrouped } from '@/components/checkbox'
import { Input } from '@/components/fields/'
import { usePermissionStore, useRoleStore, useAuthStore } from '@/stores'
import { transformString } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    newData: {
        type: Boolean,
        required: false,
        default: true,
    },
})

const onLoad = ref(true)
const authStore = useAuthStore()
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

const { role, errors, processing } = storeToRefs(roleStore)

const { permissions, permission, getFormatedPermissions } =
    storeToRefs(permissionStore)

/* permissions.value = [];
permission.value = {}; */

if (props.newData)
    role.value = {
        name: '',
        permissions: [],
    }

const save = async () => {
    let response = false
    if (props.newData === true) {
        response = await roleStore.create()
    } else {
        response = await roleStore.update(role.value.id)
    }

    if(Object.keys(errors.value ?? {}).length === 0) {
        emit("role-created");
        await authStore.getUserPermissions()
        router.push({ name: 'role.list' });
    }
}

const emit = defineEmits({
    'role-created': true,
})

onBeforeMount(async () => {
    await permissionStore.getPermissions().finally(() => (onLoad.value = false))
})

/**
 * Allows disabling the button in case the fields are empty.
 */
const canSubmit = computed(() => {
    return role.value.name !== '' && role.value.permissions !== 0
})
</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.custom-control-group {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    margin: -0.375rem;
}

.custom-control-group > * {
    padding: 0.375rem;
}

.border-bottom {
    border-bottom: 1px solid #dbdfea !important;
}

.title {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-family: Nunito, sans-serif;
    font-weight: 700;
    line-height: 1.1;
    color: inherit;
}
</style>
