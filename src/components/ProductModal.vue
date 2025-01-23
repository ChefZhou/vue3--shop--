<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ isNew ? '新增產品' : '編輯產品' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">輸入圖片網址</label>
                <input
                  type="text"
                  class="form-control"
                  id="imageUrl"
                  placeholder="請輸入圖片連結"
                  v-model="tempProduct.imageUrl"
                />
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label"
                  >或 上傳圖片
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input type="file" id="customFile" class="form-control" />
              </div>
              <img :src="tempProduct.imageUrl" class="img-fluid" alt="" />
              <div class="mt-5">
                <template
                  v-if="Array.isArray(tempProduct.imagesUrl)"
                  v-for="(image, key) in tempProduct.imagesUrl"
                  :key="key"
                >
                  <div class="mb-3 input-group">
                    <input
                      type="url"
                      class="form-control"
                      placeholder="請輸入連結"
                      v-model="tempProduct.imagesUrl[key]"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="tempProduct.imagesUrl.splice(key, 1)"
                    >
                      移除
                    </button>
                  </div>
                </template>
                <div>
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl?.push('') || createImages()"
                  >
                    新增圖片
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label"
                  >標題
                  <span class="text-danger" v-if="showValidation && !tempProduct.title">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': showValidation && !tempProduct.title }"
                  id="title"
                  placeholder="請輸入標題"
                  v-model="tempProduct.title"
                />
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label"
                    >分類
                    <span class="text-danger" v-if="showValidation && !tempProduct.category"
                      >*</span
                    >
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': showValidation && !tempProduct.category }"
                    id="category"
                    placeholder="請輸入分類"
                    v-model="tempProduct.category"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="unit" class="form-label"
                    >單位
                    <span class="text-danger" v-if="showValidation && !tempProduct.unit">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': showValidation && !tempProduct.unit }"
                    id="unit"
                    placeholder="請輸入單位"
                    v-model="tempProduct.unit"
                  />
                </div>
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label"
                    >原價
                    <span class="text-danger" v-if="showValidation && !tempProduct.origin_price"
                      >*</span
                    >
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': showValidation && !tempProduct.origin_price }"
                    id="origin_price"
                    placeholder="請輸入原價"
                    v-model.number="tempProduct.origin_price"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label"
                    >售價
                    <span class="text-danger" v-if="showValidation && !tempProduct.price">*</span>
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': showValidation && !tempProduct.price }"
                    id="price"
                    placeholder="請輸入售價"
                    v-model.number="tempProduct.price"
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="description"
                  placeholder="請輸入產品描述"
                  v-model="tempProduct.description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="content"
                  placeholder="請輸入產品說明內容"
                  v-model="tempProduct.content"
                ></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled"
                    v-model="tempProduct.is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled"> 是否啟用 </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
        </div>
      </div>
    </div>
  </div>

  <div class="toast-container position-fixed top-0 start-50 translate-middle-x pt-4">
    <div
      class="toast align-items-center text-white bg-success border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="toast"
    >
      <div class="d-flex">
        <div class="toast-body text-center px-4">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore'
import { Modal, Toast } from 'bootstrap'

export default {
  setup() {
    const store = useProductStore()
    return { store }
  },
  data() {
    return {
      modal: null,
      toast: null,
      tempProduct: {
        title: '',
        category: '',
        unit: '',
        origin_price: 0,
        price: 0,
        description: '',
        content: '',
        is_enabled: 1,
        imageUrl: '',
        imagesUrl: [],
      },
      isNew: false,
      showValidation: false,
      toastMessage: '',
      validationRules: {
        title: (v) => !!v || '標題為必填',
        category: (v) => !!v || '分類為必填',
        unit: (v) => !!v || '單位為必填',
        origin_price: (v) => v > 0 || '原價必須大於0',
        price: (v) => v > 0 || '售價必須大於0',
      },
    }
  },
  methods: {
    showToast(message, type = 'success') {
      this.toastMessage = message
      this.toastType = `bg-${type}`
      this.toast.show()
    },
    async updateProduct() {
      if (!this.validateForm()) return

      try {
        const res = await this.store.updateProduct(this.tempProduct, this.isNew)
        if (res.success) {
          this.modal.hide()
          this.showToast(this.isNew ? '新增產品成功' : '更新產品成功')
          this.$emit('update-success')
        }
      } catch (error) {
        this.showToast(error.message || '操作失敗', 'danger')
      }
    },
    showModal(item = null) {
      if (item) {
        this.tempProduct = JSON.parse(JSON.stringify(item))
        this.isNew = false
      } else {
        this.tempProduct = {
          title: '',
          category: '',
          unit: '',
          origin_price: 0,
          price: 0,
          description: '',
          content: '',
          is_enabled: 1,
          imageUrl: '',
          imagesUrl: [],
        }
        this.isNew = true
      }
      this.showValidation = false
      this.modal.show()
    },
    createImages() {
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
    },
    validateForm() {
      this.showValidation = true
      return Object.keys(this.validationRules).every((field) =>
        this.validationRules[field](this.tempProduct[field]),
      )
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal, {
      backdrop: 'static',
      keyboard: false,
    })
    this.toast = new Toast(this.$refs.toast)
  },
}
</script>

<style>
.img-fluid {
  max-width: 100%;
  height: auto;
}

.text-danger {
  color: #dc3545 !important;
}

.is-invalid {
  border-color: #dc3545;
}

.toast-container {
  z-index: 9999;
  margin-top: 1rem;
}

.toast {
  min-width: 200px;
  backdrop-filter: blur(4px);
  background-color: rgba(25, 135, 84, 0.9) !important;
}

.toast-body {
  font-size: 1.1rem;
  padding: 12px 24px;
}
</style>
