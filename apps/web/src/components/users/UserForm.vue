<template>
    <form @submit.prevent="handleSumbit">
        <div class="row mb-2">
            <div class="col-xl-6 mb-3">
                <Input
                    v-model="user.lastname"
                    :error="errors.lastname"
                    required
                >
                    Nom
                </Input>
            </div>

            <div class="col-xl-6 mb-3">
                <Input
                    v-model="user.firstname"
                    :error="errors.firstname"
                    required
                >
                    Prénom
                </Input>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-xl-6 mb-3">
                <Input
                    type="email"
                    v-model="user.email"
                    :error="errors.email"
                    required
                >
                    Email
                </Input>
            </div>
            <div class="col-xl-6 mb-3">
                <PhoneNumberInput
                    v-model="user.phone"
                    :error="errors.phone"
                    required
                >
                    Téléphone
                </PhoneNumberInput>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-xl-6 mb-3">
                <Input
                    v-model="user.username"
                    :error="errors.username"
                    required
                >
                    Nom d'utilisateur
                </Input>
            </div>
            <div class="col-xl-6 mb-3">
                <Input
                    v-model="user.address"
                    :error="errors.address"
                    required
                >
                    Adresse
                </Input>
            </div>
        </div>

        <div
            v-if="props.newData"
            class="row mb-3"
        >
            <div class="col-xl-6 mb-3">
                <Input
                    v-model="user.new_password"
                    type="password"
                    :error="errors.new_password"
                    required
                    placeholder="8 caractères minimum"
                >
                    Nouveau mot de passe
                </Input>
            </div>
            <div class="col-xl-6 mb-3">
                <Input
                    v-model="user.new_password_confirmation"
                    type="password"
                    :error="errors.new_password_confirmation"
                    placeholder="8 caractères minimum"
                    required
                >
                    Confirmer le mot de passe
                </Input>
            </div>
        </div>

        <div
            v-if="currentUser.service_type === 'admin-epf'"
            class="row mb-4"
        >
            <div class="col-xl-12 mb-3">
                <label
                    for="role"
                    class="mb-2"
                >
                    Rôle
                </label>

                <Multiselect
                    :loading="loadRole"
                    v-model="user.roles"
                    label="name"
                    mode="tags"
                    valueProp="id"
                    :multiple="true"
                    placeholder="Sélectionner un rôle"
                    noOptionsText="Aucun rôle"
                    noResultsText="Aucun rôle"
                    :close-on-select="true"
                    :clearOnSelect="false"
                    :object="false"
                    :options="roleNames"
                    :search="true"
                    :searchable="true"
                />
                <span
                    v-if="errors.roles"
                    class="text-danger"
                    v-text="errors.roles[0]"
                ></span>
            </div>

            <div class="col-xl-12 mb-3">
                <label
                    for="role"
                    class="mb-2"
                >
                    Permissions specifiques
                </label>

                <Multiselect
                    :loading="loadPermission"
                    v-model="user.specific_permissions"
                    label="name"
                    mode="tags"
                    valueProp="id"
                    :multiple="true"
                    placeholder="Sélectionner les permissions"
                    noOptionsText="Aucun permission"
                    noResultsText="Aucun permission"
                    :close-on-select="true"
                    :clearOnSelect="false"
                    :object="false"
                    :options="permissionNames"
                    :search="true"
                    :searchable="true"
                />
                <span
                    v-if="errors.specific_permissions"
                    class="text-danger"
                    v-text="errors.specific_permissions[0]"
                ></span>
            </div>

            <div class="col-xl-12">
                <label
                    for="role"
                    class="mb-2"
                >
                    Type de service
                </label>
                <Multiselect
                    v-model="user.service_type"
                    label="name"
                    valueProp="id"
                    :multiple="true"
                    placeholder="Sélectionner un service"
                    noOptionsText="Aucun service"
                    noResultsText="Aucun service"
                    :close-on-select="true"
                    :clearOnSelect="false"
                    :object="false"
                    :options="SERVICE_TYPES"
                    :search="true"
                    :searchable="true"
                />
                <span
                    v-if="errors.roles"
                    class="text-danger"
                    v-text="errors.roles[0]"
                ></span>
            </div>
        </div>
        

        <div class="row mb-2 mt-3">
            <div class="col-xl-12 d-flex justify-content-end">
                <button
                    v-if="
                        !props.newData &&
                        authStore.isAllowed('user.reset_password')
                    "
                    :isLoading="resetProcessing"
                    class="btn btn-sm me-3"
                    @click.prevent="confirmRestPassword"
                >
                    <i class="fa fa-sync-alt me-1"></i>
                    Réinitialiser le mot de passe
                </button>

                <Button
                    color="danger"
                    :to="{ name: 'user.list' }"
                    class="me-3"
                >
                    Fermer
                    <i class="fa fa-close me-1"></i>
                </Button>
                <Button
                    type="submit"
                    color="success"
                    :loading="processing"
                    :disabled="!canSubmit"
                >
                    <span>
                        <i class="fa fa-save me-2"></i>
                        Enregistrer
                    </span>
                </Button>
            </div>
        </div>
    </form>
</template>

<script setup>
import Button from '@/components/buttons'
import { Input, PhoneNumberInput } from '@/components/fields'
import { useAuthStore, useRoleStore, useUserStore, usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { capitalizeFirstLetter, translate } from '@/utils'

const router = useRouter()

const props = defineProps({
    newData: {
        type: Boolean,
        required: false,
        default: true,
    },
})

const loadRole = ref(true)
const loadPermission = ref(true)
const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

const userStore = useUserStore()
const { user, errors, processing, resetProcessing } = storeToRefs(userStore)

const roleStore = useRoleStore()
const { roles } = storeToRefs(roleStore)

const permissionStore = usePermissionStore()
const { permissions } = storeToRefs(permissionStore)

if (props.newData) {
    user.value = {
        lastname: '',
        firstname: '',
        email: '',
        phone: '',
        username: '',
        address: '',
        roles: [],
        specific_permissions: [],
        new_password: '',
        new_password_confirmation: '',
    }
    roles.value = []
    specific_permissions.value = []
    errors.value = []
}

onMounted(
    async () => {
        user.value.service_type = user.value.service_type ?? 'admin-epf'

        await roleStore.getRoles().finally(() => (loadRole.value = false))
        await permissionStore.getPermissions().finally(() => (loadPermission.value = false))
    }
)

const handleSumbit = async () => {
    const response = props.newData ? await userStore.create() : await userStore.update(user.value.id)

    if (response) {
        emit('user-created')
        if (user.value.id === currentUser.value.id) await authStore.getUserPermissions()
        router.push({ name: 'user.list' })
    }
}

const confirmRestPassword = () => {
    Swal.fire({
        title: 'Voulez-vous réinitialiser le mot de passe à "password" ?',
        text: 'Vous ne pourrez pas revenir en arrière !',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, réinitialise-le !',
        cancelButtonText: 'Annuler',
    }).then(async (result) => {
        if (result.isConfirmed) {
            if (!props.newData) {
                await userStore.handleResetPassword(user.value.id)
            }
        }
    })
}

const emit = defineEmits({
    'user-created': true,
})

const canSubmit = computed(
    () =>
        user.value?.lastname?.length !== 0 &&
        user.value?.firstname?.length !== 0 &&
        user.value?.email?.length !== 0 &&
        user.value?.phone?.length !== 0 &&
        user.value?.username?.length !== 0 &&
        user.value?.address?.length !== 0 &&
        user.value?.new_password === user.value?.new_password_confirmation,
)

const roleNames = computed(() =>
    roles.value.map(({ id, name }) => ({
        id: id,
        name: capitalizeFirstLetter(translate(name)),
    })),
)

const permissionNames = computed(() =>
    permissions.value.map(({ id, description }) => ({
        id: id,
        name: capitalizeFirstLetter(translate(description)),
    })),
)

const SERVICE_TYPES = [
    {
        id: 'admin-epf',
        name: 'Admin EPF',
    },
    {
        id: 'agent',
        name: 'Agent',
    },
];
</script>
