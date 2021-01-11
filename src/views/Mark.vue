<template>
    <div class="au-mark">
        <div class="search-card">
            <p class="search-title">条件查询</p>
            <el-form :model="searchForm" label-position="left" label-width="70px">
                <el-form-item label="起始时间">
                    <el-date-picker
                            placeholder="选择日期"
                            type="date"
                            v-model="searchForm.beginDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            placeholder="选择日期"
                            type="date"
                            v-model="searchForm.endDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="波段">
                    <el-radio-group v-model="searchForm.band">
                        <el-radio-button label="G"></el-radio-button>
                        <el-radio-button label="V"></el-radio-button>
                        <el-radio-button label="R"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="searchByTime">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="result mark-result">
<!--            <div class="image-container mark-image-container">-->
<!--                <div class="current-image-container">-->
<!--                    <div class="control-button" id="left-button">-->
<!--                        <i class="el-icon-arrow-left"></i>-->
<!--                    </div>-->
<!--                    <div class="control-button" id="right-button">-->
<!--                        <i class="el-icon-arrow-right"></i>-->
<!--                    </div>-->
<!--                    <img-->
<!--                            alt="查询结果图片"-->
<!--                            class="current-image"-->
<!--                            src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1329314336,1703660449&fm=26&gp=0.jpg"-->
<!--                    />-->
<!--                </div>-->
<!--                <div class="images-container"></div>-->
<!--            </div>-->
<!--            <div class="mark-form-card">-->
<!--                <el-form :model="markForm">-->
<!--                    <el-form-item>-->
<!--                        <el-radio-->
<!--                                :key="index"-->
<!--                                :label="index"-->
<!--                                class="type-radio"-->
<!--                                v-for="(type, index) in types"-->
<!--                                v-model="markForm.type"-->
<!--                        >{{ type }}-->
<!--                        </el-radio>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item>-->
<!--                        <el-button @click="submitMark">提交</el-button>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </div>-->
                    <div class="mark-thumbs-container" ref="thumbs">
                        <div  v-for="(thumb, index) in thumbs"
                              :key="thumb.name"
                              class="mark-thumb-container"
                              >
                            <img
                                 :src="`data:image/png;base64,${thumb.thumb}`"
                                 class="mark-thumb"
                                 @click="selectNewImage($event, thumb.name, index)"/>
                            <p>{{thumb.name}}</p>
                        </div>
                    </div>
            </div>
    </div>
</template>

<script>
    import {getThumb} from "../api/search";

    export default {
        name: "AuMark",
        data() {
            return {
                searchForm: {
                    beginDate: "",
                    endDate: "",
                    band: "G",
                },
                types: ["多重弧", "帷幔型冕状", "放射型冕状", "热点型极光"],
                markForm: {
                    type: 0,
                },
                thumbs:[],
            };
        },
        created() {
            this.initData({});
        },
        methods: {
            searchByTime() {
                const params = {};

                const beginDate = this.searchForm.beginDate;
                const endDate = this.searchForm.endDate;
                console.log(beginDate);
                console.log(endDate);

                if (beginDate == null || endDate == null) {
                    this.$message.error("请输入正确格式的起始时间和结束时间");
                    return;
                } else if (beginDate > endDate) {
                    this.$message.error("起始时间应小于结束时间");
                    return;
                } else {

                    // this.$set(this.searchForm,'beginDate',current_date);
                    // this.$set(this.searchForm,"endDate",current_date);

                    // this.searchForm.beginDate = `${beginDate.getFullYear()}${String(
                    //   beginDate.getMonth() + 1
                    // ).padStart(2, "0")}${String(beginDate.getDate()).padStart(
                    //   2,
                    //   "0"
                    // )}000000`;
                    // this.searchForm.endDate = `${endDate.getFullYear()}${String(
                    //   endDate.getMonth() + 1
                    // ).padStart(2, "0")}${String(endDate.getDate()).padStart(2)}235959`;
                    params.startTime = this.dateToString(this.searchForm.beginDate, true);
                    params.endTime = this.dateToString(this.searchForm.endDate, false);
                }

                params.band = this.searchForm.band[0];

                console.log(params);

                getThumb(params)
                    .then((res) => {
                        // console.log("ret: " + res.data);
                        this.thumbs = res.data;
                        // console.log(this.thumb[0]);
                        // 还原 查询表单和当前大图
                        this.currentImage = null;
                        console.log("name:" + this.thumbs[0].name);
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
                console.log(this.markForm);
            },
            async initData() {
                const now = new Date();
                this.$set(this.searchForm, 'beginDate', now);
                this.$set(this.searchForm, "endDate", now);
            },
            dateToString(date, isStart) {
                let result = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
                if (isStart == true) {
                    result += '000000';
                } else {
                    result += '235959';
                }
                console.log(result);
                return result;
            }
        },
    };
</script>

<style>
    .au-mark {
        display: flex;
        padding: 30px 20px;
        flex: 1;
        align-items: flex-start;
    }

    .mark-result {
        display: flex;
        align-items: stretch;
    }

    .search-card {
        flex: 2 1;
        border: 1px solid #e6e6e6;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 10px;
    }

    .search-title {
        margin: 0 0 25px 0;
        color: #839c9d;
        font-size: 20px;
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

    .mark-thumbs-container {
        border: 1px solid #e6e6e6;
        width: 100%;
        height: 500px;
        padding: 5px;
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
        grid-auto-rows: minmax(300px,auto);
    }


    .mark-thumb-container{
        margin:20px;
        border: 1px solid #e6e6e6;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .mark-thumb {
        width: 200px;
        object-fit: contain;
        padding-top: 20px;
    }

    .mark-thumb.active {
        box-shadow: 0 0 0 3px #aaa;
    }
    .mark-form-card {
        flex: 3;
        min-width: 100px;
        height: 200px;
        margin: 20px 20px 0 0;
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
