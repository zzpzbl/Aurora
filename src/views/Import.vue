<template>
  <div class="au-import">
    <div class="import-card">
      <el-form :model="imageForm" label-width="70px" label-position="top">
          <el-form-item>
            <el-upload
              class="image-uploader import-image-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleImageChange"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP"
            >
              <img
                v-if="imageForm.image"
                :src="imageForm.image"
                class="selected-image"
              />
              <i v-else class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitNewImage">上传</el-button></el-form-item
          >
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuImport',
  data() {
    return {
      imageForm: {
        image: null,
        raw: null
      },
    }
  },
  methods: {
    submitNewImage() {
      if (this.imageForm.image) {
        console.log(this.imageForm);
      } else {
        this.$message.error("请选择图片");
      }
    },
    handleImageChange(file) {
      console.log(file.raw);
      this.imageForm.raw = file.raw;
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = (e) => {
        this.imageForm.image = e.target.result;
      };
    },
  },
}
</script>

<style scoped>
.au-import {
  display: flex;
  justify-content: center;
}

.import-card {
  margin: 20px auto;
  padding: 20px 20px 0 20px;
  border: 1px solid #efefef;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

.import-image-uploader {
  width: 400px;
  height: 400px;
}
</style>