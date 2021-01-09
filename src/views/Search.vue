<template>
  <div class="au-search">
    <el-tabs type="border-card" v-model="activeMethod">
      <el-tab-pane label="时间查询" name="time"
        ><el-form :model="timeForm" label-width="70px" label-position="left">
          <el-form-item label="起始时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="timeForm.beginDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="timeForm.endDate"
            ></el-date-picker
          ></el-form-item>
          <el-form-item label="波段">
            <el-checkbox-group v-model="timeForm.band" :min="0" :max="1">
              <el-checkbox-button label="G">G</el-checkbox-button>
              <el-checkbox-button label="V">V</el-checkbox-button>
              <el-checkbox-button label="R">R</el-checkbox-button>
            </el-checkbox-group></el-form-item
          >
          <el-form-item label="类型">
            <el-select v-model="timeForm.type" placeholder="请选择">
              <el-option
                v-for="(type, index) in types"
                :key="index"
                :value="index"
                :label="type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchByTime">查询</el-button></el-form-item
          ></el-form
        ></el-tab-pane
      >
      <el-tab-pane label="原图查询" name="image">
        <el-form :model="imageForm" label-width="70px" label-position="top">
          <el-form-item>
            <el-upload
              class="image-uploader"
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
            <el-button @click="searchByImage">查询</el-button></el-form-item
          >
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="result">
      <div class="time-result" v-show="activeMethod === 'time'">
        <div class="image-container">
          <div class="current-image-container">
            <div
              id="left-button"
              @click="handleLeftClick"
              class="control-button"
            >
              <i class="el-icon-arrow-left"></i>
            </div>
            <div
              id="right-button"
              @click="handleRightClick"
              class="control-button"
            >
              <i class="el-icon-arrow-right"></i>
            </div>
            <img
              v-show="currentImage"
              ref="currentImage"
              alt="查询结果图片"
              class="current-image"
            />
          </div>
          <div class="thumbs-container" ref="thumbs">
            <img
              v-for="(thumb, index) in thumbs"
              :key="thumb.name"
              :src="`data:image/png;base64,${thumb.thumb.data}`"
              class="thumb"
              @click="selectNewImage($event, thumb.name, index)"
            />
          </div>
        </div>
        <div class="keogram-container">
          <img
            v-show="currentKeogram"
            ref="currentKeogram"
            class="keogram-image"
            alt="keogram"
          />
        </div>
      </div>
      <div class="image-result" v-show="activeMethod === 'image'">
        <div class="similar" v-for="image in similarImages" :key="image.name">
          <div class="similar-image-conatiner">
            <img :src="`data:image/png;base64,${image.rawpic.data}`" alt="相似图片">
          </div>
          <p class="similar-info">image.name</p>
          <p class="similar-info">相似度：12</p>
        </div>
        <div class="similar">
          <div class="similar-image-container">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAtwC3AAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2OTApLCBxdWFsaXR5ID0gODYK/9sAQwAQCwwODAoQDg0OEhEQExgnGRgWFhgwIiQcJzkyPDs4Mjc2P0daTD9DVUQ2N05rT1VdYGVmZT1Lb3duYnZaY2Vh/9sAQwEREhIYFRguGRkuYUE3QWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh/8AAEQgBaAFoAwEiAAIRAQMRAf/EABYAAQEBAAAAAAAAAAAAAAAAAAABBv/EAB0QAQACAwEBAQEAAAAAAAAAAAABETFBYXEhgbH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDBAI0AABo4AAAqACoAAAAYAAAF0gKgACgICggqAKhIBYACoBIACooIAATwAOgAAAAABAAHoAeooBgAAAAAAAANAG1QAAAAADwAkAAAAIAAADoAZACTwAAAAAAARRAWxFAEUEUAAAALAKAA+AAAABwAkAAAAAAAAAAADJ0AAAAACADIAAAAAIAAqKCEqgAoAIoIqKAAAAB6AB9AuQPgAAAHy1QAAAAAAAAAAAAAgDYAIApoAABAAAyAKgAqKCKiggoAGCgAAAqgAAAAAAAAAAAAAAADQH4ZAAAA2SgKAACAoAIAAAAtoAKigiooIpAAIoAICgAAAAABYAAKACAABAdAAAAAAAABBaQFAAABAAABAAAAUAA0KAAACKAAAAAAAAAAKEABoAQAAAAABF4ACKgAoCCoAAAAqACAAAAAAKAAqACgAAAAAAAAZFIAAAALAQAAAAABBUAAAAAAAAAAVARUABQAQCAAVFFRRAURQAAAAP6AAAKBsAAAAEAAAAAAQAABQAAAAAARUEAAFAEUAAAABVQAWwAAEAAANCgAABCKAAACCKAAABYACAAKAAAAAAIAIAoIACwigIoAfQBQABUAFQBQAA4AAAAAAAAAAACAKCAAAqAAAABkAAEAEFQAW0AUQBQQFEUAAUABUVAFEAVFAEUAAAEBQAAAQAFQAAAAAAAAAAAQAQAAVAAVAAAFRQABQAAAAAFEAUAARQEVAUQBUAAAAAAAAAAAAAAARAAAAAAAAIVABUAURQBFAAFD0AAAAAFQAAAAAAAAAAAAAAAAEAQFABAAAAAAFQAAAAAAAVFAQUAAUEUAAAJAAAAAAAAAAQFABFTIIAoCKgAoCAAAAAAAAAAAAAAAAqAAogKCAoACKAAAAAIKAIAoigiiSCiAAKCAAoAIAAAAAAAAAAAAAAAAAAAAogCoAKgCoAKioAACiACoACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACggAKIoIqAKgAKgAAACggAAAAAAAAAAAAAAAAAAAAAAAKgAAAKgAAAAAAAAAAAAAKgAACoAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAACoAAAKgAAAAAqAAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k="
            />
          </div>
          <p class="similar-info">N031221G000006</p>
          <p class="similar-info">相似度：12</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getThumb, getImageByName, getKeogram, getSimilarByImage } from "../api/search";

export default {
  name: "AuSearch",
  data() {
    return {
      activeMethod: "time",
      timeForm: {
        beginDate: new Date("2003-12-01"),
        endDate: new Date("2003-12-31"),
        band: [],
        type: 0,
      },
      imageForm: {
        image: null,
        raw: null,
      },
      currentImage: null,
      currentKeogram: null,
      types: ["不限", "多重弧", "帷幔型冕状", "放射型冕状", "热点型极光"],
      thumbs: [],
      currentThumbIndex: 0,
      similarImageNames: [],
      similarImages: [] // 每次得到图片往里面push
    };
  },
  methods: {
    restoreTimeForm() {
      this.timeForm.beginDate = new Date("2003-12-01");
      this.timeForm.endDate = new Date("2003-12-31");
      // this.timeForm.band = [];
    },
    searchByTime() {
      const beginDate = new Date(this.timeForm.beginDate);
      const endDate = new Date(this.timeForm.endDate);

      this.timeForm.beginDate = `${beginDate.getFullYear()}${String(
        beginDate.getMonth() + 1
      ).padStart(2, "0")}${String(beginDate.getDate()).padStart(2, "0")}000000`;
      this.timeForm.endDate = `${endDate.getFullYear()}${String(
        endDate.getMonth() + 1
      ).padStart(2, "0")}${String(endDate.getDate()).padStart(2)}235959`;

      console.log(this.timeForm.beginDate);
      console.log(this.timeForm.endDate);

      if (new Date(this.timeForm.beginDate) > new Date(this.timeForm.endDate)) {
        this.$message.error("起始时间应小于结束时间");
        return;
      }

      this.currentKeogram = null;

      console.log(this.timeForm);

      const params = {
        startTime: this.timeForm.beginDate,
        endTime: this.timeForm.endDate,
        manualtype: this.timeForm.type,
      };

      if (this.timeForm.band[0]) {
        params.band = this.timeForm.band[0];
      }

      // console.log("params", params);

      getKeogram(params)
        .then((res) => {
          // console.log("keogram", res.data.data);
          this.currentKeogram = res.data.data;
          this.$refs.currentKeogram.src = `data:image/png;base64,${this.currentKeogram}`;
        })
        .catch((err) => console.error(err));

      getThumb(params)
        .then((res) => {
          this.thumbs = res.data.data;
          // console.log(this.thumbs);
          // 还原 查询表单和当前大图
          this.restoreTimeForm();
          this.currentImage = null;
          if (this.thumbs.length) {
            setTimeout(() => this.selectNewImage(null, this.thumbs[0].name), 300)
          }
        })
        .catch((err) => console.error(err));
    },
    searchByImage() {
      if (this.imageForm.image) {
        getSimilarByImage(this.imageForm.raw)
          .then((res) => {
            // resultCode: 500
            console.log('查找相似', res.data);
            this.similarImageNames = res.data.data;
            console.log(this.similarImageNames);
          })
      } else {
        this.$message.error("请选择图片");
      }
    },
    handleImageChange(file) {
      this.imageForm.raw = file.raw;
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = (e) => {
        this.imageForm.image = e.target.result;
      };
    },
    selectNewImage(e, name, index) {
      // console.log(name, e);
      if (e) {
        this.currentThumbIndex = index;
        // console.log(this.$refs.thumbs.children);
        this.$refs.thumbs.children.forEach((element) => {
          element.classList.remove("active");
        });
        e.target.classList.add("active");
      } else {
        this.$refs.thumbs.children[this.currentThumbIndex].classList.add('active');
        // 未知错误
        // console.log(this.$refs.thumbs.children);
        // console.log(this.$refs.thumbs.children[0]);
      }
      getImageByName(name)
        .then((res) => {
          this.currentImage = res.data.data;
          console.log(this.currentImage);
          this.$refs.currentImage.src = `data:image/png;base64,${this.currentImage.rawpic.data}`;
        })
        .catch((err) => console.error(err));
    },
    handleLeftClick() {
      if (this.currentThumbIndex > 0) {
        this.$refs.thumbs.children[this.currentThumbIndex].classList.remove('active');
        this.currentThumbIndex--;
        this.selectNewImage(null, this.thumbs[this.currentThumbIndex].name);
      }
    },
    handleRightClick() {
      if (this.currentThumbIndex < this.thumbs.length - 1) {
        this.$refs.thumbs.children[this.currentThumbIndex].classList.remove('active');
        this.currentThumbIndex++;
        this.selectNewImage(null, this.thumbs[this.currentThumbIndex].name);
      }
    },
  },
};
</script>

<style>
.au-search {
  display: flex;
  align-items: flex-start;
  padding: 30px 20px;
}

.el-tabs {
  flex: 2 1 100px;
}

.result {
  flex: 10 1;
  border: 1px solid #efefef;
  border-radius: 10px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  margin: 0 0 0 20px;
}

.image-upload-slot {
  color: #839c9d;
  position: relative;
  top: -12px;
}

.image-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #839c9d;
}

.image-uploader:hover {
  border-color: #409eff;
  color: #409eff;
}

.selected-image {
  object-fit: contain;
  width: 100%;
}

.time-result {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
}

.image-result {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: minmax(300px, auto);
  grid-gap: 20px;
  padding: 20px;
  border: 1px solid #e6e6e6;
}

.similar {
  padding: 20px;
  border: 1px solid #e6e6e6;
}

.similar-info {
  color: #839c9d;
}

.similar-image-container {
  overflow: hidden;
}

.similar-image-container img {
  object-fit: contain;
  width: 100%;
}

.image-container {
  flex: 7;
  margin: 20px;
  border: 1px solid #e6e6e6;
  min-width: 400px;
  max-width: 883px;
  text-align: center;
}

.current-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.current-image-container img {
  width: 80%;
  border: 1px solid #e6e6e6;
}

.control-button {
  position: absolute;
  width: 40px;
  height: 60px;
  background: rgba(220, 220, 220, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
}

.control-button:hover {
  background: rgba(220, 220, 220, 0.7);
}

#left-button {
  left: 0;
}

#right-button {
  right: 0;
}

.thumbs-container {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e6e6e6;
  height: 100px;
  padding: 5px;
  overflow: auto;
  display: flex;
}

.thumbs-container::-webkit-scrollbar {
  width: 10px;
  height: 5px;
}

.thumbs-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}

.thumbs-container::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #e6e6e6;
}

.thumb {
  width: 90px;
  object-fit: contain;
  margin-right: 5px;
}

.thumb.active {
  box-shadow: 0 0 0 3px #aaa;
}

.keogram-container {
  flex: 4;
  min-width: 100px;
  margin: 20px 20px 20px 0;
  border: 1px solid #e6e6e6;
  /* position: relative;
  top: 150px; */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.keogram-image {
  object-fit: contain;
  /* width: 100%; */
  height: 100%;
  max-height: 400px;
  display: block;
}
</style>