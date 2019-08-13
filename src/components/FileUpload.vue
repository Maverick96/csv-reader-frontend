<template>
  <div>
    <div v-if="isLoading">
      <FileLoader :loaderMessage="loaderMessage" :progressVal="progressVal"></FileLoader>
    </div>

    <div v-if="!isLoading" class="drag-drop">
      <div class="file-name">
        <v-flex xs12 sm6>
          <v-text-field
            label="File Name"
            single-line
            clearable
            v-model="fileName"
            @click:clear="clearInput"
          ></v-text-field>
        </v-flex>
      </div>

      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="isFailed || isSuccess"
            @change="filesChange($event.target.name, $event.target.files)"
            accept=".csv"
            class="input-file"
          />
          <p v-if="isInitial">
            Drag your file here to begin
            <br />or click to browse
          </p>
          <div v-if="isSaving">
            <p>Uploading file : {{uploadedFiles[0].name}}</p>
            <p>
              <a href="javascript:void(0)" @click="reset()">Upload again</a>
            </p>
          </div>
        </div>
      </form>
      <div class="dropbox-final" v-if="isSuccess">
        <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Upload again</a>
        </p>
        <ul class="list-unstyled">
          <img
            :src="uploadedFiles[0].url"
            class="img-responsive img-thumbnail"
            :alt="uploadedFiles[0].originalName"
          />
        </ul>
      </div>
      <!--FAILED-->
      <div class="dropbox-final" v-if="isFailed">
        <h2>Uploaded failed.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Try again</a>
        </p>
        <pre>{{ uploadError }}</pre>
      </div>

      <div class="upload">
        <button class="upload-button v-btn button" @click="save()">Upload</button>
      </div>
    </div>
  </div>
</template>

<script>
import { upload } from "../shared/services/upload-file.js";
import FileLoader from "./FileLoader";
import { BASE_URL, MAX_FILE_SIZE } from "../shared/constants/app.constants";
import displayAlert from "../shared/services/alert";
import { setTimeout } from "timers";

console.log("URL ", `${BASE_URL}/event`);
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "UploadFile",
  data: function() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "data",
      progressVal: 0,
      isLoading: false,
      loaderMessage: "",
      formData: null,
      fileName: ""
    };
  },
  components: {
    FileLoader
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
      this.fileName = "";
    },
    resetLoaderProps() {
      this.progressVal = 0;
      this.isLoading = false;
      this.loaderMessage = "";
    },

    uploadFile() {
      this.formData = new FormData();
      this.formData.append(
        this.fileName,
        this.uploadedFiles[0],
        this.uploadedFiles[0].name
      );

      upload(this.formData)
        .then(res => {
          console.log("res", res);
          if (res.data && res.data["error_code"] === 0) {
            setTimeout(function() {
              this.currentStatus = STATUS_SUCCESS;
            }, 2000);
            displayAlert("green", "FILE UPLOADED", 5000);
          } else {
            this.currentStatus = STATUS_FAILED;
            displayAlert("red", res.data["error_desc"], 5000);
          }
          this.resetLoaderProps();
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
          this.uploadedFiles = [];
          this.resetLoaderProps();
          displayAlert("red", "FILE UPLOAD FAILED", 5000);
        });
    },
    save() {
      // upload data to the server only if file is uploaded and fileName is entered
      if (!this.isSaving || this.fileName === "") return;
      // subscribe to SSE
      this.listenToEvents();
    },
    filesChange(fieldName, fileList) {
      // handle file changes

      if (!fileList.length) return;
      // File should not be more than 20 mb
      if (fileList[0].size > MAX_FILE_SIZE) {
        displayAlert("red", "File Size more than 20MB", 5000);
        return;
      }
      console.log(fileList, "FILE");
      // append the files to FormData
      this.uploadedFiles = fileList;
      this.currentStatus = STATUS_SAVING;
    },
    listenToEvents() {
      const eventSource = new EventSource(`${BASE_URL}/event`);
      // upload file once sse is subscribed
      eventSource.onopen = () => {
        this.uploadFile();
        this.isLoading = true;
      };
      // Handler for events without an event type specified
      eventSource.onmessage = e => {
        console.log(e, "EVENT");
        const event = JSON.parse(e.data);
        const eventType = event.event;
        const sseData = event.data;

        this.loaderMessage = sseData.msg;
        // stage 1 denotes file is being uploaded
        if (sseData.stage == 1) {
          this.progressVal = sseData.msg;
        } else if (sseData.stage == 3 || sseData.error) {
          setTimeout(
            function() {
              this.resetLoaderProps();
              eventSource.close();
            }.bind(this),
            3000
          );
        }
      };
    },
    clearInput: function() {
      this.fileName = "";
      console.log("CLEARED");
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style>
.drag-drop {
  position: relative;
  top: 15vh;
}

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: #9e9081;
  color: dimgray;
  padding: 10px 10px;
  min-height: 50vh; /* minimum height */
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 50vh;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover,
.dropbox-final:hover {
  background: #c0bbb5; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

.dropbox-final {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
  justify-content: center;
  align-items: center;
  background-color: #9e9081;
  outline: 2px dashed grey; /* the dash box */
}

.upload {
  display: flex;
  justify-content: center;
}

.upload-button {
  width: 300px;
  height: 75px;
}
.file-name {
  display: flex;
  justify-content: center;
}
</style>
