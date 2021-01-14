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
            <div class="mark-thumbs-container" ref="thumbs">
                <div :key="thumb.name"
                     class="mark-thumb-container"
                     v-for="(thumb) in thumbs"
                     @click="startMark(thumb.name)">
                    <img
                            :src="`data:image/png;base64,${thumb.thumb}`"
                            class="mark-thumb"/>
                    <p>{{thumb.name}}</p>
                </div>
            </div>
        </div>
        <el-dialog
                :visible.sync="dialogVisible"
                title="选择类型"
                width="60%">
            <div class="image-dialog">
                <div class="image-container mark-image-container">
                    <div class="current-image-container">
                        <img
                                alt="查询结果图片"
                                class="current-image"
                                :src=currentImage
                        />
                    </div>
                    <div class="images-container"></div>
                </div>
                <div class="mark-form-card">
                    <el-form :model="markForm">
                        <el-form-item>
                            <el-radio
                                    :key="index"
                                    :label="index"
                                    class="type-radio"
                                    v-for="(type, index) in types"
                                    v-model="markForm.type"
                            >{{ type }}
                            </el-radio>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="submitMark" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getImageByName, getThumb, setImageType} from "../api/search";

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
                thumbs: [],
                dialogVisible: false,
                imageName:"",
                currentImage: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1329314336,1703660449&fm=26&gp=0.jpg"
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
                    params.start = this.dateToString(this.searchForm.beginDate, true);
                    params.end = this.dateToString(this.searchForm.endDate, false);
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
                        // if (this.thumbs.length) {
                        //     setTimeout(
                        //         () => this.selectImageToMark(this.thumbs[0].name),
                        //         300
                        //     );
                        // }
                    })
                    .catch((err) => console.error(err));
            },
            submitMark() {
                this.dialogVisible = false;
                const params = {};
                params.manualtype = this.markForm.type;
                params.name = this.imageName;
                setImageType(params).then();
                console.log(params.name);
                console.log(this.markForm.type);
            },
            async initData() {
                this.$set(this.searchForm, 'beginDate', new Date("2003-12-01"));
                this.$set(this.searchForm, "endDate", new Date("2003-12-31"));
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
            },
            startMark(name) {
                this.dialogVisible = true;
                this.imageName = name;
                getImageByName(name).then((res) => {
                    this.currentImage = `data:image/png;base64,${res.data.image}`;
                })
                    .catch((err) => console.error(err));
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
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-auto-rows: minmax(300px, auto);
    }


    .mark-thumb-container {
        margin: 20px;
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

    .image-dialog {
        display: flex;
    }

    .el-form-item__content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>
