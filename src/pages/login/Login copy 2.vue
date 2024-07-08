<template>
  <a-button type="link" @click="showModal">点击登录</a-button>

  <a-modal
    class="login-modal"
    ref="modalRef"
    v-model:open="open"
    :wrap-style="{ overflow: 'hidden' }"
    width="400px"
    :mask="true"
    :maskClosable="true"
    :footer="null"
    :maskStyle="{
      backgroundColor: 'transparent',
      backdropFilter: 'blur(10px)',
    }"
  >
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>

    <div style="background-color: transparent">
      <h2
        ref="modalTitleRef"
        style="
          cursor: move;
          text-align: center;
          font-size: 36px;
          font-weight: 500;
        "
      >
        {{ isRegister ? "注册" : "登录" }}
      </h2>

      <a-form @submit.prevent="handleSubmit">
        <a-form-item has-feedback v-bind="validateInfos.email">
          <template #label>
            <span style="font-size: 1rem">邮箱</span>
          </template>
          <a-input
            size="large"
            placeholder="请输入"
            allow-clear
            v-model:value="form.email"
            @blur="validate('email', { trigger: 'blur' }).catch(() => {})"
          />
          <!-- <template #prefix>
              <MailOutlined />
            </template> -->
        </a-form-item>
        <a-form-item v-if="isRegister" v-bind="validateInfos.code">
          <template #label>
            <span style="font-size: 16px">验证码</span>
          </template>
          <a-input-group compact>
            <a-input
              v-model:value="form.code"
              style="width: calc(50%)"
              placeholder="请输入"
              @blur="validate('code', { trigger: 'blur' }).catch(() => {})"
            />
            <a-button type="dashed" :disabled="countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}秒` : "发送验证码" }}
            </a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item
          style="font-size: 16px"
          has-feedback
          v-bind="validateInfos.password"
        >
          <template #label>
            <span style="font-size: 16px">密码</span>
          </template>
          <a-input-password
            size="large"
            placeholder="请输入"
            v-model:value="form.password"
          >
            <!-- <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template> -->
          </a-input-password>
          <!-- <a-input v-model="form.password" type="password" placeholder="请输入密码"
        @blur="validate('email', { trigger: 'blur' }).catch(() => { })"></a-input> -->
        </a-form-item>

        <a-form-item>
          <a-button
            size="large"
            block
            type="primary"
            shape="round"
            @click.prevent="onSubmit"
            >{{ isRegister ? "注册" : "登录" }}</a-button
            >
            <!-- htmlType="submit" -->
        </a-form-item>
        <a-flex
        justify="space-between"
        align="center"
        >
        <!-- :style="{ ...boxStyle }" -->
          <a @click="toggleForm">{{
            isRegister ? "已有账号，去登录" : "没有账号，去注册"
          }}</a>
          <a @click="forgot_pwd">找回密码</a>
        </a-flex>
      </a-form>
    </div>
  </a-modal>
  <!-- <a-modal ref="modalRef" :wrap-style="{ overflow: 'hidden' }" v-model:open="open1"
    style="background-color: #f8f9f9;padding:0;border: 2px solid #e8e8e8;border-radius: 10px;">
   
    Windows Linux子系统(WSL)。是否
    
  </a-modal> -->
  <contextHolder />
</template>

<script setup>
import { ref, reactive, toRaw, computed, watch, watchEffect } from "vue";
import axios from "axios";
import { message, notification } from "ant-design-vue";
import { Form } from "ant-design-vue";
import { useDraggable } from "@vueuse/core";

const useForm = Form.useForm;
const [api, contextHolder] = notification.useNotification();
const open = ref(true);
const showModal = () => {
  open.value = true;
};
const modalTitleRef = ref(null);
const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref(0);
const startY = ref(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});
watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});
const transformStyle = computed(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});
const form = ref({
  email: "1339718850@qq.com",
  password: "123456",
  code: "",
});
const auth_code = ref("DWF1");
// 创建更新 formData 的函数
const updateFormData = () => {
  const formData = new FormData();
  formData.append("username", form.value.email);
  formData.append("password", form.value.password);
  return formData;
};
const isRegister = ref(false);
const countdown = ref(0);

function toggleForm() {
  isRegister.value = !isRegister.value;
}
const code_key = "code_key";
const sendCode = async () => {
  msg_large(
    "info",
    key,
    "正在发送验证码...",
    "路漫漫其修远兮，吾将上下而求索。",
    "top",
    2.5
  );

  // 模拟发送验证码操作
  console.log("发送验证码");
  countdown.value = 6;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
    }
  }, 1000);
  // 调用发送验证码逻辑
  // verify_auth()
  // setTimeout(() => {
  //   msg_large('success', key, '已发送，注意查收！', '青青子衿，悠悠我心。纵我不往，子宁不嗣音？', 'top', 2.5)
  //   message.success({
  //     content: '已发送，请注意查收',
  //     code_key,
  //     duration: 2,
  //   })
  // }, 1000)
};
const key = "login";
const msg_large = async (
  api_type = "success",
  key = null,
  message = "你好",
  description = "",
  placement = "top",
  duration = 2
) => {
  api[api_type]({
    key,
    message,
    description,
    placement,
    duration,
  });
};
async function handleSubmit() {
  // console.log('提交表单', form.value);
  // 这里应该是调用后端接口的代码，以下是模拟
  try {
    if (isRegister.value) {
      // 注册
      registerUser();
    } else {
      // 登录
      loginUser();
    }
  } catch (error) {
    msg_large(
      "warning",
      key,
      "出错了",
      "啊哦，我们没有接收到您的请求",
      "top",
      2.5
    );
  }
}
const loginUser = async () => {
  // 这里是登录逻辑
  const formData = updateFormData();
  // console.log('登录', userForm.value, formData);
  // msg_large('success',key, '欢迎回来！', '正是江南好风景，落花时节又逢君。', 'top', 2)
  try {
    const response = await axios.post(
      "https://tool.gcqweb.cn/gcqweb/login/",
      formData
    );
    console.log(response?.data);
    msg_large(
      "success",
      key,
      "欢迎回来！",
      "正是江南好风景，落花时节又逢君。",
      "top",
      2
    );
    // messageApi.success('欢迎回来！');
    open.value = false;
  } catch (error) {
    
    console.error(error);
    if ([403, 401, 404, 400].includes(error.response.status)) {
      // messageApi.error('邮箱或密码错误！');
      msg_large(
        "error",
        key,
        error.response.data.detail||"邮箱或密码错误",
        "长风破浪会有时，直挂云帆济沧海。",
        "top",
        2.5
      );
    }
  }
};

const registerUser = async () => {
  // 这里是注册逻辑
  const formData = updateFormData();
  // console.log('注册', userForm.value, formData);
  try {
    const response = await axios.post(
      "https://tool.gcqweb.cn/gcqweb/signup/",
      formData
    );
    console.log(response.data);
    // messageApi.success('注册成功，Nice to meet you！');
    msg_large(
      "success",
      key,
      "注册成功",
      "有朋自远方来，不亦乐乎！" || "与君初相识，犹如故人归。",
      "top",
      2
    );
    open.value = false;
  } catch (error) {
    
    console.error(error.response.data.detail,'zc');
    if ([403, 401, 404, 400].includes(error.response.status)) {
      // messageApi.error('邮箱已被注册！');
      msg_large(
      "error",
      key,
      error.response.data.detail ||"服务器无响应",
      "曾经沧海难为水，除却巫山不是云。" ||
        "弱水三千只取一瓢饮，繁华三千只为一人留。",
      "top",
      2.5
    );
    }
  }
};
const logout = async () => {
  // 这里是退出登录逻辑
  const formData = updateFormData();
  console.log("退出登录");
  try {
    const response = await axios.post(
      "http://192.168.8.116:1996/user/logout/",
      formData
    );
    console.log(response.data);
    // messageApi.success('期待与你再次相遇😂');
    msg_large(
      "success",
      key,
      "已退出登录",
      "海内存知己，天涯若比邻。" || "春草明年绿，王孙归不归？",
      "top",
      2
    );
  } catch (error) {
    // if (error.response.status === 401) {
    if (error.response.status === 403) {
      // messageApi.error('请先登录！');
      msg_large(
        "success",
        key,
        "请先登录",
        "此情可待成追忆？只是当时已惘然。",
        "top",
        2
      );
    }
    console.error(error);
  }
};

// 验证
const verify_auth = async () => {
  const formData = updateFormData();
  formData.append("code", auth_code.value);
  try {
    const response = await axios.post(
      "http://192.168.8.116:1996/user/verify/",
      formData
    );
    console.log(response.data);
    if (response.data.message === "验证成功") {
      // msg_large('success',key, '已发送，注意查收！', '青青子衿，悠悠我心。纵我不往，子宁不嗣音？', 'top', 2.5)
      // messageApi.success('验证成功！');
    }
    open.value = false;
  } catch (error) {
    console.error(error);
    if (error.response.status === 401) {
      // messageApi.error('验证码错误！');
      msg_large("error", key, "验证码错误", "朽木不可雕也", "top", 2);
    }
  }
};

const rulesRef = reactive({
  email: [
    {
      required: true,
      message: "你似乎忘记了什么",
      // trigger: 'blur',
    },
    {
      // 邮箱regex
      pattern:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "这不是 Email",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
    },
  ],
  code: [
    {
      required: false,
      message: "验证码不能为空",
    },
    {
      // 最少6位
      min: 4,
      max: 4,
      message: "验证码为4位",
      trigger: "blur",
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(form.value, rulesRef);
const onSubmit = () => {
  validate()
    .then(() => {
      handleSubmit();
    })
    .catch(err => {
      console.log('error', err);
    });
};
</script>

<style>
/* 可以在这里添加一些样式 */
.login-modal * {
  user-select: none;
}

@property --bg-angle {
  inherits: false;
  initial-value: 0deg;
  syntax: "<angle>";
}

@keyframes spin {
  to {
    --bg-angle: 360deg;
  }
}

.ant-modal .ant-modal-content {
  border-radius: 8px;
  animation: spin 15s infinite linear paused;
  background: #fff;
  background: linear-gradient(
        to bottom,
        oklch(1 0 0 / 0.95),
        oklch(1 0 0 / 0.95)
      )
      padding-box,
    conic-gradient(
        from var(--bg-angle) in oklch longer hue,
        oklch(0.85 0.37 0) 0 0
      )
      border-box;
  border: 2px solid transparent;
}

.ant-modal .ant-modal-content:hover {
  animation-play-state: running;
}
</style>
