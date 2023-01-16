<form id="formUpload">
    <div id="formLeft">
        <h4>Title</h4>
        <input type="text" id="title" class="inputPadding inputProfile" name="title" maxlength="40" placeholder="Title">
        <h4>Category</h4>
        <select id="category" class="inputProfile" name="category">
            <option value="">Choose a category</option>
            <option value="Eat & Drink">Eat & Drink</option>
            <option value="See & Do">See & Do</option>
            <option value="Stay & Chill">Stay & Chill</option>
            <option value="Other">Other</option>
        </select>
        <h4>Upload image</h4>
        <p id="uploadInfo">We only support jpg, jpeg and png. Max size 500kb.</p>
        <input type="file" id="newPostImg" class="inputProfile" name="file">
    </div>

    <div id="formRight">
        <h4>Content</h4>
        <textarea id="content" class="inputPadding inputProfile" name="content" maxlength="1000" placeholder="Max 1000 characters"></textarea>
        <button id="newPostButton" type="submit">Submit</button>
    </div> 
</form>
