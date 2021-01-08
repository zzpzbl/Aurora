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
          <el-radio-group v-model="timeForm.band">
            <el-radio-button label="G"></el-radio-button>
            <el-radio-button label="V"></el-radio-button>
            <el-radio-button label="R"></el-radio-button></el-radio-group
        ></el-form-item>
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
          <div id="left-button" class="control-button">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div id="right-button" class="control-button">
            <i class="el-icon-arrow-right"></i>
          </div>
          <img
            src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1329314336,1703660449&fm=26&gp=0.jpg"
            alt="查询结果图片"
            class="current-image"
          />
        </div>
        <div class="images-container"></div>
      </div>
      <div class="mark-form-card">
        <el-form :model="markForm">
          <el-form-item>
            <el-radio
              v-model="markForm.type"
              v-for="(type, index) in types"
              :key="index"
              :label="index"
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
export default {
  name: "AuMark",
  data() {
    return {
      timeForm: {
        beginDate: "",
        endDate: "",
        band: "G",
        type: 0,
      },
      types: ["多重弧", "帷幔型冕状", "放射型冕状", "热点型极光"],
      markForm: {
        type: 0,
      },
    };
  },
  methods: {
    searchByTime() {
      const beginDate = new Date(this.timeForm.beginDate);
      const endDate = new Date(this.timeForm.endDate);
      if (beginDate > endDate) {
        this.$message.error("起始时间应小于结束时间");
      } else {
        this.timeForm.beginDate = `${beginDate.getFullYear()}${String(
          beginDate.getMonth() + 1
        ).padStart(2, "0")}${String(beginDate.getDate()).padStart(
          2,
          "0"
        )}000000`;
        this.timeForm.endDate = `${endDate.getFullYear()}${String(
          endDate.getMonth() + 1
        ).padStart(2, "0")}${String(endDate.getDate()).padStart(2)}235959`;
        console.log(this.timeForm);
      }
    },
    submitMark() {
      console.log(this.markForm);
    }
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

/* .mark-image-container {
  max-width: 700px;
} */

.mark-form-card {
  flex: 3;
  min-width: 100px;
  height: 200px;
  margin: 20px 20px 0 0;
  padding: 30px 0 0 20px;
}

.type-radio {
  display: block;
  margin: 0 0 20px 0;
}
</style>