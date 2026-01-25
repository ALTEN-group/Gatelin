import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { DownloadService } from "@crud/core/utils/download/download.service";
import { FileInfo } from "@form/ui/renderers/file-upload-input/file-info.class";
import { of } from "rxjs";
import { FileUploadInputComponent } from "./file-upload-input.component";

describe("FileUploadInputComponent", () => {
  let component: FileUploadInputComponent;
  let fixture: ComponentFixture<FileUploadInputComponent>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockDownloadService: jasmine.SpyObj<DownloadService>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testFile",
    label: "Test File Upload",
    controlType: CONTROL_TYPES.FILES,
  });

  beforeEach(async () => {
    mockSnackbarService = jasmine.createSpyObj("SnackbarService", [
      "displayError",
      "displaySuccess",
    ]);
    mockDownloadService = jasmine.createSpyObj("DownloadService", [
      "tryDownloadFile",
    ]);
    mockDownloadService.tryDownloadFile.and.returnValue(of(new Blob()));

    await TestBed.configureTestingModule({
      imports: [FileUploadInputComponent, ReactiveFormsModule],
      providers: [
        provideAnimations(),
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: DownloadService, useValue: mockDownloadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadInputComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl(null));
    fixture.componentRef.setInput("isFormReadonly", false);
  });

  /**
   * ========================================
   * SECTION 1: COMPONENT CREATION & INITIALIZATION
   * ========================================
   */
  describe("Component Creation & Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default config", () => {
      fixture.detectChanges();
      expect(component.config()).toBeDefined();
      expect(component.control()).toBeDefined();
    });

    it("should extend FormFieldBaseComponent", () => {
      expect(component.config).toBeDefined();
      expect(component.control).toBeDefined();
      expect(component.isFormReadonly).toBeDefined();
    });

    it("should initialize with empty localFiles", () => {
      fixture.detectChanges();
      expect(component.localFiles()).toEqual([]);
    });

    it("should initialize isDraggedOver to false", () => {
      expect(component.isDraggedOver).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render file upload container", () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector(
        ".custom-file-upload",
      );
      expect(container).toBeTruthy();
    });

    it("should render hidden file input", () => {
      fixture.detectChanges();
      const fileInput =
        fixture.nativeElement.querySelector('input[type="file"]');
      expect(fileInput).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl([]);
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
    });

    it("should set accept attribute for image media type", () => {
      const config = createDefaultConfig();
      config.controlOptions = { mediaType: "image" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.accept()).toBe("image/*");
    });

    it("should set accept attribute for specific MIME type", () => {
      const config = createDefaultConfig();
      config.controlOptions = { mediaType: "application/pdf" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.accept()).toBe("application/pdf/*");
    });

    it("should set accept attribute for file extension", () => {
      const config = createDefaultConfig();
      config.controlOptions = { mediaType: ".pdf" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.accept()).toBe(".pdf");
    });

    it("should return empty string when no media type specified", () => {
      fixture.detectChanges();
      expect(component.accept()).toBe("");
    });

    it("should allow multiple files when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.canAddMore()).toBe(true);
    });

    it("should not allow adding more files when multiple is false and file exists", () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: false };
      fixture.componentRef.setInput("config", config);
      const fileInfo = new FileInfo({
        type: "local",
        file: new File([""], "test.txt"),
        src: "",
      });
      component.localFiles.set([fileInfo]);
      fixture.detectChanges();

      expect(component.canAddMore()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 4: FILE UPLOAD & VALIDATION
   * ========================================
   */
  describe("File Upload & Validation", () => {
    it("should handle file upload", async () => {
      const file = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      // Create a DataTransfer to simulate file selection
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      fixture.detectChanges();

      await component.onFileUploaded(fileInput);

      expect(component.localFiles().length).toBe(1);
      expect(component.localFiles()[0].file?.name).toBe("test.txt");
    });

    it("should validate max file size", async () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxFileSize: 100 }; // 100 bytes
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const largeFile = new File(["x".repeat(200)], "large.txt", {
        type: "text/plain",
      });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(largeFile);
      fileInput.files = dataTransfer.files;

      await component.onFileUploaded(fileInput);

      expect(mockSnackbarService.displayError).toHaveBeenCalled();
      expect(component.localFiles().length).toBe(0);
    });

    it("should accept file within size limit", async () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxFileSize: 1000 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const smallFile = new File(["small"], "small.txt", {
        type: "text/plain",
      });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(smallFile);
      fileInput.files = dataTransfer.files;

      await component.onFileUploaded(fileInput);

      expect(component.localFiles().length).toBe(1);
    });

    it("should handle multiple file uploads", async () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const file1 = new File(["content1"], "file1.txt", {
        type: "text/plain",
      });
      const file2 = new File(["content2"], "file2.txt", {
        type: "text/plain",
      });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file1);
      dataTransfer.items.add(file2);
      fileInput.files = dataTransfer.files;

      await component.onFileUploaded(fileInput);

      expect(component.localFiles().length).toBe(2);
    });

    it("should replace file when multiple is false", async () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: false };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      // Upload first file
      const file1 = new File(["content1"], "file1.txt", {
        type: "text/plain",
      });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      const dataTransfer1 = new DataTransfer();
      dataTransfer1.items.add(file1);
      fileInput.files = dataTransfer1.files;

      await component.onFileUploaded(fileInput);
      expect(component.localFiles().length).toBe(1);

      // Upload second file (should replace)
      const file2 = new File(["content2"], "file2.txt", {
        type: "text/plain",
      });
      const dataTransfer2 = new DataTransfer();
      dataTransfer2.items.add(file2);
      fileInput.files = dataTransfer2.files;

      await component.onFileUploaded(fileInput);
      expect(component.localFiles().length).toBe(1);
      expect(component.localFiles()[0].file?.name).toBe("file2.txt");
    });
  });

  /**
   * ========================================
   * SECTION 5: USER INTERACTIONS & EVENTS
   * ========================================
   */
  describe("User Interactions & Events", () => {
    it("should emit uploadFile event on file upload", async () => {
      fixture.detectChanges();
      spyOn(component, "emitInteractionEvent");

      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      await component.onFileUploaded(fileInput);

      expect(component.emitInteractionEvent).toHaveBeenCalledWith(
        "uploadFile",
        jasmine.any(Array),
      );
    });

    it("should emit clearFile event on file removal", () => {
      fixture.detectChanges();
      spyOn(component, "emitInteractionEvent");

      const fileInfo = new FileInfo({
        type: "local",
        file: new File([""], "test.txt"),
        src: "",
      });
      component.localFiles.set([fileInfo]);

      const fileInput = document.createElement("input");
      fileInput.type = "file";

      component.clear(0, fileInput);

      expect(component.emitInteractionEvent).toHaveBeenCalledWith(
        "clearFile",
        0,
      );
    });

    it("should emit clearAllFiles event on clear all", () => {
      fixture.detectChanges();
      spyOn(component, "emitInteractionEvent");

      const fileInput = document.createElement("input");
      fileInput.type = "file";

      component.clearAll(fileInput);

      expect(component.emitInteractionEvent).toHaveBeenCalledWith(
        "clearAllFiles",
      );
    });

    it("should update control value on file upload", async () => {
      const control = new FormControl<null | File[]>(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      await component.onFileUploaded(fileInput);

      expect(control.value).toBeDefined();
      expect(control.value?.length).toBe(1);
    });
  });

  /**
   * ========================================
   * SECTION 6: DRAG & DROP
   * ========================================
   */
  describe("Drag & Drop", () => {
    it("should set isDraggedOver on drag over", () => {
      const event = new DragEvent("dragover");
      spyOn(event, "preventDefault");

      component.onDragOver(event);

      expect(component.isDraggedOver).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("should reset isDraggedOver on drag leave", () => {
      const event = new DragEvent("dragleave");
      spyOn(event, "preventDefault");

      component.isDraggedOver = true;
      component.onDragLeave(event);

      expect(component.isDraggedOver).toBe(false);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("should handle file drop", async () => {
      fixture.detectChanges();
      component.isDraggedOver = true;

      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      // Create DataTransfer and set to fileInput first
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const event = new DragEvent("drop");
      Object.defineProperty(event, "dataTransfer", {
        value: dataTransfer,
        writable: false,
      });
      spyOn(event, "preventDefault");

      component.onDrop(event, fileInput);
      // Since onDrop doesn't await onFileUploaded, we need to manually call it with await
      await component.onFileUploaded(fileInput);

      expect(component.isDraggedOver).toBe(false);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.localFiles().length).toBe(1);
    });

    it("should prevent default on drag events", () => {
      const event = new DragEvent("dragover");
      spyOn(event, "preventDefault");

      component.prevent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  /**
   * ========================================
   * SECTION 7: FILE MANAGEMENT
   * ========================================
   */
  describe("File Management", () => {
    it("should clear specific file", () => {
      const file1 = new FileInfo({
        type: "local",
        file: new File([""], "file1.txt"),
        src: "",
      });
      const file2 = new FileInfo({
        type: "local",
        file: new File([""], "file2.txt"),
        src: "",
      });
      component.localFiles.set([file1, file2]);

      const fileInput = document.createElement("input");
      fileInput.type = "file";

      component.clear(0, fileInput);

      expect(component.localFiles().length).toBe(1);
      expect(component.localFiles()[0].file?.name).toBe("file2.txt");
    });

    it("should clear all files", () => {
      const file1 = new FileInfo({
        type: "local",
        file: new File([""], "file1.txt"),
        src: "",
      });
      const file2 = new FileInfo({
        type: "local",
        file: new File([""], "file2.txt"),
        src: "",
      });
      component.localFiles.set([file1, file2]);

      const fileInput = document.createElement("input");
      fileInput.type = "file";

      component.clearAll(fileInput);

      expect(component.localFiles().length).toBe(0);
    });

    it("should reset file input value on clear", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      // Add a file to the input
      const file = new File([""], "test.txt");
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      component.clearAll(fileInput);

      expect(fileInput.value).toBe("");
    });
  });

  /**
   * ========================================
   * SECTION 8: FILE DOWNLOAD
   * ========================================
   */
  describe("File Download", () => {
    it("should download local file", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const fileInfo = new FileInfo({
        type: "local",
        file,
        src: "data:text/plain;base64,Y29udGVudA==",
      });

      spyOn(window.URL, "createObjectURL").and.returnValue("blob:url");
      spyOn(window.URL, "revokeObjectURL");

      component.onDownload(fileInfo);

      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:url");
    });

    it("should download remote file", () => {
      const fileInfo = new FileInfo({
        type: "server",
        src: "https://example.com/file.pdf",
      });

      component.onDownload(fileInfo);

      expect(mockDownloadService.tryDownloadFile).toHaveBeenCalledWith(
        "https://example.com/file.pdf",
        "file.pdf",
        false,
      );
    });
  });

  /**
   * ========================================
   * SECTION 9: READONLY & DISABLED STATES
   * ========================================
   */
  describe("Readonly & Disabled States", () => {
    it("should handle readonly state from parent", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      expect(component.isFormReadonly()).toBe(true);
    });

    it("should reflect disabled state from control", () => {
      const disabledControl = new FormControl({ value: null, disabled: true });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });

    it("should not be disabled by default", () => {
      fixture.detectChanges();
      expect(component.isDisabled()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 10: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle null FileList", async () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.files = null;

      fixture.detectChanges();

      await component.onFileUploaded(fileInput);

      expect(component.localFiles().length).toBe(0);
    });

    it("should handle empty FileList", async () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      fixture.detectChanges();

      await component.onFileUploaded(fileInput);

      expect(component.localFiles().length).toBe(0);
    });

    it("should handle drop event without dataTransfer", async () => {
      const event = new DragEvent("drop");
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      fixture.detectChanges();

      await component.onDrop(event, fileInput);

      expect(component.localFiles().length).toBe(0);
    });

    it("should initialize localFiles from control value", () => {
      const fileInfo = new FileInfo({
        type: "local",
        file: new File([""], "test.txt"),
        src: "",
      });
      const control = new FormControl([fileInfo]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.localFiles().length).toBe(1);
      expect(component.localFiles()[0].file?.name).toBe("test.txt");
    });

    it("should handle null control value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.localFiles()).toEqual([]);
    });
  });
});
