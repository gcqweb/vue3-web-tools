<template>
  <section class="base64Str">
    <h2>Base64编码解码</h2>
    <p>注意：base64<strong>解码</strong>仅支持英文字符，不支持中文。</p>
    <br />

    <a-form>
      <a-form-item label="原始字符串">
        <a-textarea
          allowClear
          v-model:value="normalString"
          placeholder="输入原始字符串"
        ></a-textarea>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="convertToBase64"
            >Base64编码</a-button
          >
          <a-button @click="convertToNormal">Base64解码</a-button>
          <a-button danger @click="clear">全部清空</a-button>
        </a-space>
      </a-form-item>
      <a-form-item label="转换后的字符串">
        <a-textarea
          allowClear
          
          v-model:value="base64String"
          placeholder="转换后的字符串"
        ></a-textarea>
      </a-form-item>
      <!-- :autosize="{ minRows: 4 }" -->
    </a-form>
    <a-button type="primary" @click="copyFn(base64String)">复制结果</a-button>
    <br />
    <br />
    <hr />
    <br />
    <div>
      <div class="panel-body">
        <h3>Base64编码说明，什么是Base64编码</h3>
        <p>
          　　Base64编码是一种用64个字符来表示任意二进制数据的方法，常用于在URL、Cookie、网页中传输二进制数据。
        </p>
        <p>
          　　Base64编码要求把3个8位字节（3*8=24）转化为4个6位的字节（4*6=24），之后在6位的前面补两个0，形成8位一个字节的形式。
          如果剩下的字符不足3个字节，则用0填充，输出字符使用'='，因此编码后输出的文本末尾可能会出现1或2个'='。
        </p>
        <p>
          　　为了保证所输出的编码位可读字符，Base64制定了一个编码表，以便进行统一转换。编码表的大小为2^6=64，这也是Base64名称的由来。
        </p>
        <p>
          　　Base64常用于处理文本数据的场合，表示、传输、存储一些二进制数据，包括MIME的电子邮件及XML的一些复杂数据。
        </p>
        <br>
        <h3>Base64编码原理</h3>
        <p>
          Base64的编码都是按字符串长度，以每3个8bit的字符为一组；<br />
          然后针对每组，首先获取每个字符的ASCII编码；<br />
          然后将ASCII编码转换成8bit的二进制，得到一组3*8=24bit的字节；<br />
          然后将这24bit划分为4个6bit的字节，并在每个6bit的字节前面都填两个高位0，得到4个8bit的字节；<br />
          然后将这4个8bit的字节转换成10进制，对照Base64编码表
          （下表），得到对应编码后的字符。
        </p>
        <br>
        <h3>Base64编码表</h3>
        <table class="table table-bordered table-striped text-center">
          <tbody>
            <tr>
              <th class="text-center">码值</th>
              <th class="text-center">对应字符</th>
              <th class="text-center">码值</th>
              <th class="text-center">对应字符</th>
              <th class="text-center">码值</th>
              <th class="text-center">对应字符</th>
              <th class="text-center">码值</th>
              <th class="text-center">对应字符</th>
            </tr>
            <tr>
              <td>0</td>
              <td>A</td>
              <td>17</td>
              <td>R</td>
              <td>34</td>
              <td>i</td>
              <td>51</td>
              <td>z</td>
            </tr>
            <tr>
              <td>1</td>
              <td>B</td>
              <td>18</td>
              <td>S</td>
              <td>35</td>
              <td>j</td>
              <td>52</td>
              <td>0</td>
            </tr>
            <tr>
              <td>2</td>
              <td>C</td>
              <td>19</td>
              <td>T</td>
              <td>36</td>
              <td>k</td>
              <td>53</td>
              <td>1</td>
            </tr>
            <tr>
              <td>3</td>
              <td>D</td>
              <td>20</td>
              <td>U</td>
              <td>37</td>
              <td>l</td>
              <td>54</td>
              <td>2</td>
            </tr>
            <tr>
              <td>4</td>
              <td>E</td>
              <td>21</td>
              <td>V</td>
              <td>38</td>
              <td>m</td>
              <td>55</td>
              <td>3</td>
            </tr>
            <tr>
              <td>5</td>
              <td>F</td>
              <td>22</td>
              <td>W</td>
              <td>39</td>
              <td>n</td>
              <td>56</td>
              <td>4</td>
            </tr>
            <tr>
              <td>6</td>
              <td>G</td>
              <td>23</td>
              <td>X</td>
              <td>40</td>
              <td>o</td>
              <td>57</td>
              <td>5</td>
            </tr>
            <tr>
              <td>7</td>
              <td>H</td>
              <td>24</td>
              <td>Y</td>
              <td>41</td>
              <td>p</td>
              <td>58</td>
              <td>6</td>
            </tr>
            <tr>
              <td>8</td>
              <td>I</td>
              <td>25</td>
              <td>Z</td>
              <td>42</td>
              <td>q</td>
              <td>59</td>
              <td>7</td>
            </tr>
            <tr>
              <td>9</td>
              <td>J</td>
              <td>26</td>
              <td>a</td>
              <td>43</td>
              <td>r</td>
              <td>60</td>
              <td>8</td>
            </tr>
            <tr>
              <td>10</td>
              <td>K</td>
              <td>27</td>
              <td>b</td>
              <td>44</td>
              <td>s</td>
              <td>61</td>
              <td>9</td>
            </tr>
            <tr>
              <td>11</td>
              <td>L</td>
              <td>28</td>
              <td>c</td>
              <td>45</td>
              <td>t</td>
              <td>62</td>
              <td>+</td>
            </tr>
            <tr>
              <td>12</td>
              <td>M</td>
              <td>29</td>
              <td>d</td>
              <td>46</td>
              <td>u</td>
              <td>63</td>
              <td>/</td>
            </tr>
            <tr>
              <td>13</td>
              <td>N</td>
              <td>30</td>
              <td>e</td>
              <td>47</td>
              <td>v</td>
              <td>　</td>
              <td>　</td>
            </tr>
            <tr>
              <td>14</td>
              <td>O</td>
              <td>31</td>
              <td>f</td>
              <td>48</td>
              <td>w</td>
              <td>　</td>
              <td>　</td>
            </tr>
            <tr>
              <td>15</td>
              <td>P</td>
              <td>32</td>
              <td>g</td>
              <td>49</td>
              <td>x</td>
              <td>　</td>
              <td>　</td>
            </tr>
            <tr>
              <td>16</td>
              <td>Q</td>
              <td>33</td>
              <td>h</td>
              <td>50</td>
              <td>y</td>
              <td>　</td>
              <td>　</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";
const { toClipboard } = useClipboard();
const normalString = ref("");
const base64String = ref("");

// const convertToBase64 = () => {
//   try {
//     base64String.value = btoa(normalString.value);
//   } catch (e) {
//     alert('转换为Base64时出错');
//   }
// };
// const convertToNormal = () => {
//   try {
//     //   normalString.value = atob(base64String.value);
//     base64String.value = atob(normalString.value);
//   } catch (e) {
//     alert('转换为普通字符串时出错');
//   }
// };
const convertToBase64 = () => {
  try {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(normalString.value);
    base64String.value = btoa(String.fromCharCode(...encodedData));
  } catch (e) {
    alert("Base64编码出错");
  }
};

const convertToNormal = () => {
  try {
    const decodedData = atob(normalString.value);
    const decoder = new TextDecoder();
    base64String.value = decoder.decode(
      Uint8Array.from(decodedData, (c) => c.charCodeAt(0))
    );
  } catch (e) {
    alert("base64解码出错");
  }
};

const clear = () => {
  normalString.value = "";
  base64String.value = "";
};
const copyFn = async (text) => {
  try {
    await toClipboard(text.toString());
    message.success("已复制到剪切板");
  } catch (e) {
    console.error(e);
    message.error("剪切板异常，请刷新后重试！");
  }
};
</script>

<style scoped>
.base64Str {
  padding: 1.2rem;
  width: 1000px;
  margin: 0 auto;
  margin-top: 1rem;
  /* border: 2px solid #ccc; */
}
:deep() .ant-input-group-addon {
  cursor: pointer;
}
@media screen and (max-width: 500px) {
  :deep() .ant-space {
    flex-direction: column;
  }
  :deep() .ant-space-align-center {
    align-items: start;
  }
  .base64Str {
    width: 100%;
    height: auto;
  }
}
</style>
