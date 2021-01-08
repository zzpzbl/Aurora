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
        <div class="keogram-container">
          <img
            src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2006651127,2585315559&fm=26&gp=0.jpg"
            class="keogram-image"
            alt="keogram"
          />
        </div>
      </div>
      <div class="image-result" v-show="activeMethod === 'image'">
        <div class="similar">
          <div class="similar-image-container">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAtwC3AAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2OTApLCBxdWFsaXR5ID0gODYK/9sAQwAQCwwODAoQDg0OEhEQExgnGRgWFhgwIiQcJzkyPDs4Mjc2P0daTD9DVUQ2N05rT1VdYGVmZT1Lb3duYnZaY2Vh/9sAQwEREhIYFRguGRkuYUE3QWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh/8AAEQgBaAFoAwEiAAIRAQMRAf/EABYAAQEBAAAAAAAAAAAAAAAAAAABBv/EAB0QAQACAwEBAQEAAAAAAAAAAAABETFBYXEhgbH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDBAI0AABo4AAAqACoAAAAYAAAF0gKgACgICggqAKhIBYACoBIACooIAATwAOgAAAAABAAHoAeooBgAAAAAAAANAG1QAAAAADwAkAAAAIAAADoAZACTwAAAAAAARRAWxFAEUEUAAAALAKAA+AAAABwAkAAAAAAAAAAADJ0AAAAACADIAAAAAIAAqKCEqgAoAIoIqKAAAAB6AB9AuQPgAAAHy1QAAAAAAAAAAAAAgDYAIApoAABAAAyAKgAqKCKiggoAGCgAAAqgAAAAAAAAAAAAAAADQH4ZAAAA2SgKAACAoAIAAAAtoAKigiooIpAAIoAICgAAAAABYAAKACAABAdAAAAAAAABBaQFAAABAAABAAAAUAA0KAAACKAAAAAAAAAAKEABoAQAAAAABF4ACKgAoCCoAAAAqACAAAAAAKAAqACgAAAAAAAAZFIAAAALAQAAAAABBUAAAAAAAAAAVARUABQAQCAAVFFRRAURQAAAAP6AAAKBsAAAAEAAAAAAQAABQAAAAAARUEAAFAEUAAAABVQAWwAAEAAANCgAABCKAAACCKAAABYACAAKAAAAAAIAIAoIACwigIoAfQBQABUAFQBQAA4AAAAAAAAAAACAKCAAAqAAAABkAAEAEFQAW0AUQBQQFEUAAUABUVAFEAVFAEUAAAEBQAAAQAFQAAAAAAAAAAAQAQAAVAAVAAAFRQABQAAAAAFEAUAARQEVAUQBUAAAAAAAAAAAAAAARAAAAAAAAIVABUAURQBFAAFD0AAAAAFQAAAAAAAAAAAAAAAAEAQFABAAAAAAFQAAAAAAAVFAQUAAUEUAAAJAAAAAAAAAAQFABFTIIAoCKgAoCAAAAAAAAAAAAAAAAqAAogKCAoACKAAAAAIKAIAoigiiSCiAAKCAAoAIAAAAAAAAAAAAAAAAAAAAogCoAKgCoAKioAACiACoACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACggAKIoIqAKgAKgAAACggAAAAAAAAAAAAAAAAAAAAAAAKgAAAKgAAAAAAAAAAAAAKgAACoAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAACoAAAKgAAAAAqAAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k="
            />
          </div>
          <p class="similar-info">N031221G000006</p>
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
        <div class="similar">
          <div class="similar-image-container">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAtwC3AAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2OTApLCBxdWFsaXR5ID0gODYK/9sAQwAQCwwODAoQDg0OEhEQExgnGRgWFhgwIiQcJzkyPDs4Mjc2P0daTD9DVUQ2N05rT1VdYGVmZT1Lb3duYnZaY2Vh/9sAQwEREhIYFRguGRkuYUE3QWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh/8AAEQgBaAFoAwEiAAIRAQMRAf/EABYAAQEBAAAAAAAAAAAAAAAAAAABBv/EAB0QAQACAwEBAQEAAAAAAAAAAAABETFBYXEhgbH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDBAI0AABo4AAAqACoAAAAYAAAF0gKgACgICggqAKhIBYACoBIACooIAATwAOgAAAAABAAHoAeooBgAAAAAAAANAG1QAAAAADwAkAAAAIAAADoAZACTwAAAAAAARRAWxFAEUEUAAAALAKAA+AAAABwAkAAAAAAAAAAADJ0AAAAACADIAAAAAIAAqKCEqgAoAIoIqKAAAAB6AB9AuQPgAAAHy1QAAAAAAAAAAAAAgDYAIApoAABAAAyAKgAqKCKiggoAGCgAAAqgAAAAAAAAAAAAAAADQH4ZAAAA2SgKAACAoAIAAAAtoAKigiooIpAAIoAICgAAAAABYAAKACAABAdAAAAAAAABBaQFAAABAAABAAAAUAA0KAAACKAAAAAAAAAAKEABoAQAAAAABF4ACKgAoCCoAAAAqACAAAAAAKAAqACgAAAAAAAAZFIAAAALAQAAAAABBUAAAAAAAAAAVARUABQAQCAAVFFRRAURQAAAAP6AAAKBsAAAAEAAAAAAQAABQAAAAAARUEAAFAEUAAAABVQAWwAAEAAANCgAABCKAAACCKAAABYACAAKAAAAAAIAIAoIACwigIoAfQBQABUAFQBQAA4AAAAAAAAAAACAKCAAAqAAAABkAAEAEFQAW0AUQBQQFEUAAUABUVAFEAVFAEUAAAEBQAAAQAFQAAAAAAAAAAAQAQAAVAAVAAAFRQABQAAAAAFEAUAARQEVAUQBUAAAAAAAAAAAAAAARAAAAAAAAIVABUAURQBFAAFD0AAAAAFQAAAAAAAAAAAAAAAAEAQFABAAAAAAFQAAAAAAAVFAQUAAUEUAAAJAAAAAAAAAAQFABFTIIAoCKgAoCAAAAAAAAAAAAAAAAqAAogKCAoACKAAAAAIKAIAoigiiSCiAAKCAAoAIAAAAAAAAAAAAAAAAAAAAogCoAKgCoAKioAACiACoACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACggAKIoIqAKgAKgAAACggAAAAAAAAAAAAAAAAAAAAAAAKgAAAKgAAAAAAAAAAAAAKgAACoAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAACoAAAKgAAAAAqAAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k="
            />
          </div>
          <p class="similar-info">N031221G000006</p>
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
        <div class="similar">
          <div class="similar-image-container">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAtwC3AAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2OTApLCBxdWFsaXR5ID0gODYK/9sAQwAQCwwODAoQDg0OEhEQExgnGRgWFhgwIiQcJzkyPDs4Mjc2P0daTD9DVUQ2N05rT1VdYGVmZT1Lb3duYnZaY2Vh/9sAQwEREhIYFRguGRkuYUE3QWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh/8AAEQgBaAFoAwEiAAIRAQMRAf/EABYAAQEBAAAAAAAAAAAAAAAAAAABBv/EAB0QAQACAwEBAQEAAAAAAAAAAAABETFBYXEhgbH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDBAI0AABo4AAAqACoAAAAYAAAF0gKgACgICggqAKhIBYACoBIACooIAATwAOgAAAAABAAHoAeooBgAAAAAAAANAG1QAAAAADwAkAAAAIAAADoAZACTwAAAAAAARRAWxFAEUEUAAAALAKAA+AAAABwAkAAAAAAAAAAADJ0AAAAACADIAAAAAIAAqKCEqgAoAIoIqKAAAAB6AB9AuQPgAAAHy1QAAAAAAAAAAAAAgDYAIApoAABAAAyAKgAqKCKiggoAGCgAAAqgAAAAAAAAAAAAAAADQH4ZAAAA2SgKAACAoAIAAAAtoAKigiooIpAAIoAICgAAAAABYAAKACAABAdAAAAAAAABBaQFAAABAAABAAAAUAA0KAAACKAAAAAAAAAAKEABoAQAAAAABF4ACKgAoCCoAAAAqACAAAAAAKAAqACgAAAAAAAAZFIAAAALAQAAAAABBUAAAAAAAAAAVARUABQAQCAAVFFRRAURQAAAAP6AAAKBsAAAAEAAAAAAQAABQAAAAAARUEAAFAEUAAAABVQAWwAAEAAANCgAABCKAAACCKAAABYACAAKAAAAAAIAIAoIACwigIoAfQBQABUAFQBQAA4AAAAAAAAAAACAKCAAAqAAAABkAAEAEFQAW0AUQBQQFEUAAUABUVAFEAVFAEUAAAEBQAAAQAFQAAAAAAAAAAAQAQAAVAAVAAAFRQABQAAAAAFEAUAARQEVAUQBUAAAAAAAAAAAAAAARAAAAAAAAIVABUAURQBFAAFD0AAAAAFQAAAAAAAAAAAAAAAAEAQFABAAAAAAFQAAAAAAAVFAQUAAUEUAAAJAAAAAAAAAAQFABFTIIAoCKgAoCAAAAAAAAAAAAAAAAqAAogKCAoACKAAAAAIKAIAoigiiSCiAAKCAAoAIAAAAAAAAAAAAAAAAAAAAogCoAKgCoAKioAACiACoACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACggAKIoIqAKgAKgAAACggAAAAAAAAAAAAAAAAAAAAAAAKgAAAKgAAAAAAAAAAAAAKgAACoAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAACoAAAKgAAAAAqAAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k="
            />
          </div>
          <p class="similar-info">N031221G000006</p>
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
export default {
  name: "AuSearch",
  data() {
    return {
      activeMethod: "time",
      timeForm: {
        beginDate: "",
        endDate: "",
        band: "G",
        type: 0,
      },
      imageForm: {
        image: null,
      },
      currentImage: null,
      types: ["多重弧", "帷幔型冕状", "放射型冕状", "热点型极光"],
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
    searchByImage() {
      if (this.imageForm.image) {
        console.log(this.imageForm);
      } else {
        this.$message.error("请选择图片");
      }
    },
    handleImageChange(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = (e) => {
        this.imageForm.image = e.target.result;
      };
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

.images-container {
  border: 1px solid #e6e6e6;
  height: 100px;
  margin: 20px;
}

.keogram-container {
  flex: 4;
  min-width: 100px;
  margin: 20px 20px 20px 0;
  border: 1px solid #e6e6e6;
}

.keogram-image {
  object-fit: container;
  width: 100%;
}
</style>