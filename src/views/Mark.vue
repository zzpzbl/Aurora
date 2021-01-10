<template>
  <div class="au-mark">
    <div class="search-card">
      <p class="search-title">通过时间查询</p>
      <el-form :model="timeForm" label-width="70px" label-position="left">
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
      >
    </div>
    <div class="result mark-result">
      <div class="image-container mark-image-container">
        <div class="current-image-container">
          <div id="left-button" class="control-button" @click="handleLeftClick">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div
            id="right-button"
            class="control-button"
            @click="handleRightClick"
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
      <div class="mark-form-card">
        <el-form :model="markForm">
          <el-form-item>
            <el-radio
              v-model="markForm.type"
              v-for="(type, index) in types.slice(1)"
              :key="index"
              :label="String(index+1)"
              class="type-radio"
              >{{ type }}</el-radio
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="submitMark">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getThumb, getImageByName } from "../api/search";
import { getTypeByName, updateType } from "../api/meta";

export default {
  name: "AuMark",
  data() {
    return {
      timeForm: {
        beginDate: new Date("2003-12-01"),
        endDate: new Date("2003-12-31"),
        band: [],
        type: 0,
      },
      types: ["不限", "多重弧", "帷幔型冕状", "放射型冕状", "热点型极光"],
      markForm: {
        type: 0,
      },
      currentImage: null,
      thumbs: [],
      currentThumbIndex: 0,
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
      if (beginDate > endDate) {
        this.$message.error("起始时间应小于结束时间");
        return;
      }

      this.currentKeogram = null;

      this.timeForm.beginDate = `${beginDate.getFullYear()}${String(
        beginDate.getMonth() + 1
      ).padStart(2, "0")}${String(beginDate.getDate()).padStart(2, "0")}000000`;
      this.timeForm.endDate = `${endDate.getFullYear()}${String(
        endDate.getMonth() + 1
      ).padStart(2, "0")}${String(endDate.getDate()).padStart(2)}235959`;
      console.log(this.timeForm);

      const params = {
        startTime: this.timeForm.beginDate,
        endTime: this.timeForm.endDate,
      };

      if (this.timeForm.manualtype !== '0') {
        params.manualtype = this.timeForm.manualtype;
      }

      if (this.timeForm.band[0]) {
        params.band = this.timeForm.band[0];
      }

      // console.log("params", params);

      getThumb(params)
        .then((res) => {
          this.thumbs = res.data.data;
          // console.log(this.thumbs);
          // 还原 查询表单和当前大图
          this.restoreTimeForm();
          this.currentImage = null;
          if (this.thumbs.length) {
            setTimeout(
              () => this.selectNewImage(null, this.thumbs[0].name),
              300
            );
          }
        })
        .catch((err) => console.error(err));
    },
    submitMark() {
      const params = {
        name: this.currentImage.name,
        manualtype: this.markForm.type,
      };
      // console.log('这个格式不行？', params);
      updateType(params)
        .then(() => {
          this.$message.success('标注成功');
        })
        .catch((err) => console.error(err));
      // console.log(this.markForm);
      // console.log(this.currentImage);
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
        this.$refs.thumbs.children[this.currentThumbIndex].classList.add(
          "active"
        );
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
      getTypeByName(name)
        .then((res) => {
          console.log('获取type', res.data.data.manualtype, res.data.data.name);
          this.markForm.type = res.data.data.manualtype;
        })
        .catch((err) => console.error(err));
    },
    handleLeftClick() {
      if (this.currentThumbIndex > 0) {
        this.$refs.thumbs.children[this.currentThumbIndex].classList.remove(
          "active"
        );
        this.currentThumbIndex--;
        this.selectNewImage(null, this.thumbs[this.currentThumbIndex].name);
      }
    },
    handleRightClick() {
      if (this.currentThumbIndex < this.thumbs.length - 1) {
        this.$refs.thumbs.children[this.currentThumbIndex].classList.remove(
          "active"
        );
        this.currentThumbIndex++;
        this.selectNewImage(null, this.thumbs[this.currentThumbIndex].name);
      }
    },
  },
};
</script>

<style>
.au-mark {
  display: flex;
  align-items: flex-start;
  padding: 30px 20px;
}

.mark-result {
  display: flex;
  align-items: flex-start;
  min-height: 270px;
}

.search-card {
  flex: 2 1 100px;
  border: 1px solid #e6e6e6;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  padding: 20px 0 0 20px;
  border-radius: 10px;
}

.search-title {
  margin: 0 0 25px 0;
  color: #839c9d;
  font-size: 20px;
}

.mark-form-card {
  flex: 3;
  min-width: 100px;
  height: 200px;
  margin: 0 20px 0 0;
  padding: 30px 0 0 20px;
}

.type-radio {
  margin: 0 0 25px 0;
}

.el-form-item__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>